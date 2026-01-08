import json
import os
from openai import OpenAI

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
        
        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        
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
