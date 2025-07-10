import os
import time
import json
from datetime import datetime, timedelta
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage, ImageSendMessage, ImageMessage,
    SourceUser, SourceGroup, SourceRoom
)
from google import genai
from google.genai import types
from PIL import Image
from dotenv import load_dotenv

# --- 環境變數與 API 初始化 ---
# 確保您的 .env 檔案路徑正確
load_dotenv(dotenv_path="/home/salina123001/test.env") 

# 初始化 Google AI Client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# 初始化 LINE Bot API
line_bot_api = LineBotApi(os.getenv("LINE_TOKEN"))
handler = WebhookHandler(os.getenv("LINE_SECRET"))

# 預設系統訊息
DEFAULT_SYS_MSG = os.getenv("DEFAULT_SYS_MSG") or "你是一位可愛又貼心的『小花』，說話風格像朋友聊天一樣，用自然、有點貼心、有表情符號的語氣回應。"
# 您的網站公開網址，用於顯示圖片
# !! 請務必確認並修改成您 pythonanywhere 的正確網址 !!
BASE_URL = "https://salina123001.pythonanywhere.com" 

# --- 全域設定 ---
app = Flask(__name__, static_url_path='/static', static_folder='images')
sessions = {} # 用來儲存所有使用者的對話狀態
CONVERSATION_LIMIT = 5 # 對話回合上限

# 提示訊息 (保留您的原創設計)
IMAGE_EDIT_HINT = (
    "這張圖畫好囉！🎨\n"
    "你可以試著用指令來修改它，例如：\n\n"
    "「幫牠加頂帽子」\n"
    "「背景換成夜晚的星空」"
)
FINAL_ROUND_HINT = (
    f"我們聊了 {CONVERSATION_LIMIT} 回合囉！～\n"
    "如果還需要我，再叫一次「小花」就可以開始新對話囉！👋"
)

# --- 核心架構：智慧分流 (Intelligent Routing) ---

# 1. 總指揮 (The Decision Maker)
#    此函式負責判斷使用者意圖
#    它會詢問一個快速的 AI 模型，決定接下來該找哪位專家
template_image = '''
如果我的提示敘述如下，請判斷這個需求是否最適合由「文字生成圖片」或「圖片理解/編輯」的功能來完成。

使用者提示:
```
{}
```

如果最適合由圖片功能完成, 請以下列 JSON 格式回答我, 除了 JSON 格式資料外, 不要加上額外資訊：
```
{{
    "intent": "image",
    "prompt": "你建議用來生成或編輯圖片的英文關鍵字"
}}
```
如果是一般聊天、問答或搜尋，請以下列 JSON 格式回答我：
```
{{
    "intent": "chat",
    "prompt": ""
}}
```
'''

def determine_intent(user_message: str, has_pending_image: bool):
    """
    判斷使用者意圖是「聊天/搜尋」還是「圖片相關」。
    Args:
        user_message (str): 使用者的文字訊息。
        has_pending_image (bool): 使用者是否剛上傳了一張圖片。
    Returns:
        dict: 一個包含 'intent' 和 'prompt' 的字典。
    """
    # 如果使用者剛上傳圖片，意圖必定是 'image'
    if has_pending_image:
        print("🧠 總指揮判斷：使用者已上傳圖片，意圖為 -> image")
        return {"intent": "image", "prompt": user_message}

    try:
        print(f"🧠 總指揮正在判斷意圖: '{user_message}'")
        # 使用快速的 Flash 模型來判斷
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=template_image.format(user_message),
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        intent_data = json.loads(response.text)
        print(f"🧠 總指揮判斷結果 -> {intent_data}")
        return intent_data
    except Exception as e:
        print(f"❌ 總指揮判斷失敗: {e}")
        # 若判斷失敗，預設為一般聊天
        return {"intent": "chat", "prompt": ""}

# 2. 專家A：聊天與搜尋 (Chat & Search Specialist)
def handle_chat_request(user_message: str, history: list):
    """
    處理一般聊天與需要即時搜尋的請求。
    Args:
        user_message (str): 使用者的文字訊息。
        history (list): 這位專家的獨立對話歷史。
    Returns:
        tuple: (AI 的回應, 更新後的歷史紀錄)
    """
    print("🧑‍💻 啟用「聊天/搜尋」專家...")
    chat = client.chats.create(
        model="gemini-1.5-flash", # 使用快速且支援工具的 Flash 模型
        history=history,
        config=types.GenerateContentConfig(
            system_instruction=DEFAULT_SYS_MSG,
            tools=[
                types.Tool(
                    google_search=types.GoogleSearch() # 賦予上網搜尋的能力
                )
            ]
        )
    )
    response = chat.send_message(user_message)
    return response, chat.get_history()[-10:] # 保留最近的對話

# 3. 專家B：視覺創意 (Visual Creative Specialist)
def handle_image_request(user_message: str, history: list, image_path: str = None):
    """
    處理圖片生成、理解與編輯的請求。
    Args:
        user_message (str): 使用者的文字指令。
        history (list): 這位專家的獨立對話歷史。
        image_path (str, optional): 使用者上傳的圖片路徑。
    Returns:
        tuple: (AI 的回應, 更新後的歷史紀錄)
    """
    print("🎨 啟用「視覺創意」專家...")
    chat = client.chats.create(
        model="gemini-1.5-pro-vision", # 使用強大的 Vision 模型
        history=history,
        config=types.GenerateContentConfig(
            system_instruction=DEFAULT_SYS_MSG,
            response_modalities=['Text', 'Image'] # 宣告此專家會回傳圖片
        )
    )
    
    # 建立傳送給 AI 的內容 (payload)
    payload = []
    if image_path and os.path.exists(image_path):
        print(f"🖼️ 附上使用者圖片: {image_path}")
        payload.append(Image.open(image_path))
    
    payload.append(user_message)
    
    response = chat.send_message(payload)
    return response, chat.get_history()[-10:] # 保留最近的對話

# --- 輔助與管理函數 (大部分保留您的原創設計) ---

def cleanup_sessions():
    """清理閒置超過10分鐘的對話。"""
    now = datetime.now()
    timeout = timedelta(minutes=10)
    expired_ids = [sid for sid, data in sessions.items() if now - data.get('last_active', now) > timeout]
    for sid in expired_ids:
        print(f"🧹 清除閒置對話：{sid}")
        del sessions[sid]

def cleanup_old_images():
    """清理超過1小時的舊圖片。"""
    image_dir = "images"
    if not os.path.isdir(image_dir): return
    now = time.time()
    for filename in os.listdir(image_dir):
        filepath = os.path.join(image_dir, filename)
        if os.path.isfile(filepath):
            if (now - os.path.getmtime(filepath)) > 3600:
                try:
                    os.remove(filepath)
                    print(f"🧹 已自動刪除過期圖片：{filepath}")
                except Exception as e:
                    print(f"❌ 刪除圖片失敗 {filepath}: {e}")

def check_session(session_id, user_name):
    """檢查對話是否存在，若否則建立一個新的。"""
    if session_id not in sessions:
        sessions[session_id] = {
            'user_name': user_name,
            'chat_history': [],      # 聊天專家的歷史紀錄
            'image_history': [],     # 視覺專家的歷史紀錄
            'rounds': 0,
            'last_active': datetime.now(),
            'pending_image_path': None # 使用者上傳的圖片
        }
        print(f'✅ 新增對話 session：{session_id}')
    else:
        sessions[session_id]['last_active'] = datetime.now()
        sessions[session_id]['user_name'] = user_name

def parse_gemini_response_to_line(response, source):
    """將 Gemini 的回應轉換成 LINE 的訊息格式。"""
    reply_messages = []
    text_buffer = []
    image_sent_in_this_turn = False

    for part in response.candidates[0].content.parts:
        if part.text:
            text_buffer.append(part.text)
        elif hasattr(part, 'inline_data') and "image" in part.inline_data.mime_type:
            # 如果有文字先送出
            if text_buffer:
                reply_messages.append(TextSendMessage(text="".join(text_buffer).strip()))
                text_buffer = []
            
            # 處理圖片
            image_data = part.inline_data.data
            timestamp = int(time.time())
            filename = f"gemini_chat_{timestamp}.png"
            filepath = os.path.join("images", filename)
            os.makedirs("images", exist_ok=True)
            with open(filepath, "wb") as f:
                f.write(image_data)
            
            print(f"📸 聊天中生成圖片：{filepath}")
            img_url = f"{BASE_URL}/static/{filename}"
            reply_messages.append(ImageSendMessage(original_content_url=img_url, preview_image_url=img_url))
            image_sent_in_this_turn = True

    if text_buffer:
        reply_messages.append(TextSendMessage(text="".join(text_buffer).strip()))

    # 附加圖片編輯提示
    is_personal_chat = isinstance(source, SourceUser)
    hint_message = IMAGE_EDIT_HINT.replace('「小花 ', '「') if is_personal_chat else IMAGE_EDIT_HINT
    if image_sent_in_this_turn and len(reply_messages) < 5:
        print("💡 附加圖片編輯提示。")
        reply_messages.append(TextSendMessage(text=hint_message))

    if not reply_messages:
        return [TextSendMessage(text="我好像有點想不出來了... 換個話題好嗎？😅")]
        
    return reply_messages

# --- Flask Web Server & LINE Webhook ---

@app.route('/')
def index():
    return 'Welcome to 小花 Bot!'

@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers.get('X-Line-Signature')
    body = request.get_data(as_text=True)
    try:
        handler.handle(body, signature)
    except InvalidSignatureError as e:
        print(f"❌ Invalid Signature: {e}")
        abort(400)
    return 'OK'

@handler.add(MessageEvent, message=ImageMessage)
def handle_image_message(event):
    """處理使用者上傳的圖片訊息。"""
    cleanup_old_images()
    source_id = event.source.sender_id
    profile = line_bot_api.get_profile(event.source.user_id)
    _name = profile.display_name

    check_session(source_id, _name)
    session = sessions[source_id]

    if not session.get('chat_history') and not session.get('image_history'):
         # 為了簡化，我們規定必須在對話中才能傳圖
         # 您可以自行修改此邏輯
        if not session.get('rounds') > 0:
            reply_text = "要先跟我說「小花」開始對話，我才能處理圖片喔！"
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text=reply_text))
            return

    try:
        message_content = line_bot_api.get_message_content(event.message.id)
        timestamp = int(time.time())
        filename = f"user_img_{source_id}_{timestamp}.jpg"
        filepath = os.path.join("images", filename)
        os.makedirs("images", exist_ok=True)

        with open(filepath, 'wb') as fd:
            for chunk in message_content.iter_content():
                fd.write(chunk)
        print(f"📷 收到使用者圖片並儲存至: {filepath}")

        session['pending_image_path'] = filepath
        reply_text = "收到圖片了！請告訴我要對這張圖做什麼？\n例如：「幫我把這張圖變成梵谷風格」或「形容一下這張照片」"
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=reply_text))

    except Exception as e:
        print(f"❌ 處理使用者圖片失敗: {e}")
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text="哎呀，圖片好像讀取失敗了，請再傳一次看看！"))

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    """處理文字訊息，這是整個流程的起點。"""
    cleanup_sessions()
    cleanup_old_images()

    source_id = event.source.sender_id
    is_personal_chat = isinstance(event.source, SourceUser)
    profile = line_bot_api.get_profile(event.source.user_id)
    _name = profile.display_name
    _txt = event.message.text.strip()

    print(f"\n📩 收到來自 {'個人' if is_personal_chat else '群組'}({source_id}) 的訊息，由 [{_name}] 發送：{_txt}")

    check_session(source_id, _name)
    session = sessions[source_id]
    
    # --- 對話啟動與結束邏輯 (保留您的原創設計) ---
    is_active = session['rounds'] > 0
    
    # 處理啟動指令
    if not is_active:
        if (is_personal_chat and _txt == "小花") or (not is_personal_chat and _txt.startswith("小花")):
            session['rounds'] = 1 # 標記為啟動
            session['last_active'] = datetime.now()
            prompt = _txt[len("小花"):].strip() if not is_personal_chat else ""
            
            if not prompt and not is_personal_chat:
                 line_bot_api.reply_message(event.reply_token, TextSendMessage(text=f"哈囉 {_name}！我是小花，有什麼事嗎？"))
                 return
            if is_personal_chat:
                line_bot_api.reply_message(event.reply_token, TextSendMessage(text=f"哈囉 {_name}！我是小花~\n(輸入 '881' 我就會自動退下)"))
                return
            _txt = prompt # 讓後續流程處理群組中的首次提問
        else:
            print("▶️ 對話未啟動，略過。")
            return
    
    # 處理結束指令
    if _txt.lower() == "881":
        sessions.pop(source_id, None) # 直接清除 session
        print(f"🛑 用戶 [{_name}] 從 {source_id} 手動結束對話。")
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=f"{_name}，小花先退下囉～有需要再叫我！"))
        return

    # --- 核心 AI 互動流程 ---
    try:
        # 1. 讓總指揮判斷意圖
        has_pending_image = session.get('pending_image_path') is not None
        intent_data = determine_intent(_txt, has_pending_image)
        intent = intent_data.get('intent')
        prompt_for_image = intent_data.get('prompt', _txt)

        # 2. 根據意圖，分派任務給對應的專家
        if intent == 'image':
            response, new_history = handle_image_request(
                user_message=prompt_for_image,
                history=session['image_history'],
                image_path=session.get('pending_image_path')
            )
            session['image_history'] = new_history
        else: # intent == 'chat' 或預設
            response, new_history = handle_chat_request(
                user_message=_txt,
                history=session['chat_history']
            )
            session['chat_history'] = new_history

        # 處理完畢後，清除待處理圖片
        if has_pending_image:
            session['pending_image_path'] = None

        # 3. 將 AI 回應轉換成 LINE 訊息格式並發送
        reply_messages = parse_gemini_response_to_line(response, event.source)
        
        # 4. 更新對話回合數與結束邏輯
        session['rounds'] += 1
        if session['rounds'] > CONVERSATION_LIMIT:
            print(f"⏹️ 在 {source_id} 的對話已達上限，自動結束。")
            if len(reply_messages) < 5:
                reply_messages.append(TextSendMessage(text=FINAL_ROUND_HINT))
            sessions.pop(source_id, None) # 直接清除

        if reply_messages:
            line_bot_api.reply_message(event.reply_token, messages=reply_messages[:5])

    except Exception as e:
        print(f"❌ [主流程錯誤] {type(e).__name__}: {e}")
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=f"{_name}，小花這邊卡卡的，等一下再回你好嗎？😵"))

if __name__ == "__main__":
    # 確保 images 資料夾存在
    os.makedirs("images", exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
