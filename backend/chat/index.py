import json
import os

def handler(event: dict, context) -> dict:
    '''AI-психолог с эмпатичными ответами на основе OpenAI GPT-4'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        messages = body.get('messages', [])
        
        if not messages:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Messages are required'})
            }
        
        api_key = os.environ.get('OPENAI_API_KEY')
        
        try:
            from openai import OpenAI
            
            if not api_key:
                raise ValueError('API key not set')
            
            client = OpenAI(api_key=api_key)
            
            system_prompt = """Ты профессиональный психолог с 15-летним опытом работы. Твоя задача:

1. Внимательно слушать и понимать эмоции собеседника
2. Задавать уточняющие вопросы для глубокого понимания проблемы
3. Проявлять эмпатию и поддержку
4. Давать конструктивные советы и техники
5. Никогда не осуждать, всегда быть на стороне клиента
6. Использовать техники КПТ, DBT и гуманистического подхода

Отвечай по-русски, коротко (2-4 предложения), доброжелательно и профессионально."""

            ai_messages = [{'role': 'system', 'content': system_prompt}] + messages
            
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=ai_messages,
                temperature=0.8,
                max_tokens=300
            )
            
            ai_reply = response.choices[0].message.content
            
        except Exception as openai_error:
            user_message = messages[-1]['content'].lower()
            
            greetings = ['привет', 'здравствуй', 'добрый день', 'хай', 'hello']
            stress_keywords = ['стресс', 'тревога', 'волну', 'беспокоюсь', 'переживаю']
            sad_keywords = ['грустно', 'плохо', 'депрессия', 'устал', 'больно']
            
            if any(word in user_message for word in greetings):
                ai_reply = 'Здравствуйте! Я рад, что вы обратились за поддержкой. Расскажите, что вас беспокоит? Я здесь, чтобы выслушать вас.'
            elif any(word in user_message for word in stress_keywords):
                ai_reply = 'Я понимаю, тревога может быть очень изматывающей. Давайте попробуем разобраться, что именно вызывает эти чувства? Можете рассказать подробнее о ситуации?'
            elif any(word in user_message for word in sad_keywords):
                ai_reply = 'Мне очень жаль, что вам сейчас тяжело. Ваши чувства важны, и я здесь, чтобы поддержать вас. Что происходит в вашей жизни прямо сейчас?'
            else:
                ai_reply = 'Спасибо, что поделились этим. Я внимательно слушаю. Можете рассказать больше о том, что вы чувствуете? Что для вас сейчас важнее всего?'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': ai_reply,
                'emotion': 'positive'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }