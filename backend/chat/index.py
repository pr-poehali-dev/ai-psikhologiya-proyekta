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
            import random
            
            user_message = messages[-1]['content'].lower()
            message_length = len(messages)
            
            greetings = ['привет', 'здравствуй', 'добрый', 'хай', 'hello', 'hi']
            stress_keywords = ['стресс', 'тревож', 'волну', 'беспокоюсь', 'переживаю', 'нервничаю', 'паник']
            sad_keywords = ['грустно', 'плохо', 'депресс', 'устал', 'больно', 'тяжело', 'одиноко']
            work_keywords = ['работ', 'начальник', 'коллег', 'проект', 'дедлайн', 'карьер']
            relationship_keywords = ['отношени', 'партнер', 'муж', 'жена', 'парень', 'девушка', 'расстал', 'ссор']
            question_keywords = ['как', 'что делать', 'помоги', 'совет', 'как быть', 'что мне']
            
            greeting_responses = [
                'Здравствуйте! Я рад нашей встрече. Что привело вас сегодня ко мне?',
                'Привет! Спасибо, что решили поговорить. С чего хотите начать?',
                'Добрый день! Расскажите, что вас сейчас волнует?'
            ]
            
            stress_responses = [
                'Тревога — это сигнал того, что что-то важное требует внимания. Давайте разберёмся, что именно стоит за этими чувствами?',
                'Я слышу, что вам тревожно. Это совершенно нормальная реакция. Когда вы впервые заметили эти ощущения?',
                'Понимаю, тревога может быть изматывающей. Попробуем вместе найти, что её вызывает. Опишите, в какие моменты она усиливается?'
            ]
            
            sad_responses = [
                'Мне жаль, что вам сейчас грустно. Ваши чувства имеют право быть. Расскажите, что происходит?',
                'Слышу, что вам тяжело. Иногда просто проговорить это вслух уже помогает. Что бы вы хотели, чтобы изменилось?',
                'Благодарю за откровенность. Грусть — это часть нашей жизни, но мы можем найти способы с ней справиться. Как давно вы это чувствуете?'
            ]
            
            work_responses = [
                'Рабочие вопросы действительно могут быть источником стресса. Что конкретно в работе вызывает наибольший дискомфорт?',
                'Понимаю, профессиональная сфера — важная часть жизни. Расскажите подробнее о ситуации на работе?',
                'Работа занимает много нашего времени и энергии. Как эта ситуация влияет на другие сферы вашей жизни?'
            ]
            
            relationship_responses = [
                'Отношения — одна из самых сложных, но важных сфер. Что происходит между вами?',
                'Слышу, что вопрос касается отношений. Это всегда непросто. Как вы себя чувствуете в этой ситуации?',
                'Понимаю, как может быть сложно в отношениях. Давайте попробуем разобраться, что именно вас беспокоит?'
            ]
            
            question_responses = [
                'Хороший вопрос. Давайте сначала разберёмся в ситуации глубже. Расскажите, как всё началось?',
                'Прежде чем давать советы, важно понять вас и вашу ситуацию. Опишите, что происходит?',
                'Я помогу найти решение, но сначала мне нужно узнать больше. Что для вас сейчас самое важное?'
            ]
            
            followup_responses = [
                'Продолжайте, я слушаю внимательно. Что ещё важно знать об этом?',
                'Понимаю. А как эта ситуация влияет на вашу повседневную жизнь?',
                'Спасибо за откровенность. Что вы чувствуете, когда думаете об этом?',
                'Это действительно непросто. Как долго это продолжается?',
                'Я вижу, что это для вас важно. Пробовали ли вы что-то изменить раньше?'
            ]
            
            default_responses = [
                'Расскажите подробнее, мне важно понять вашу ситуацию.',
                'Я здесь, чтобы выслушать вас. Что вы чувствуете прямо сейчас?',
                'Благодарю за доверие. Давайте разберёмся в этом вместе.',
                'Понимаю. Можете описать это подробнее?',
                'Я вас слышу. Что бы вам хотелось изменить в этой ситуации?'
            ]
            
            if message_length == 1:
                if any(word in user_message for word in greetings):
                    ai_reply = random.choice(greeting_responses)
                elif any(word in user_message for word in stress_keywords):
                    ai_reply = random.choice(stress_responses)
                elif any(word in user_message for word in sad_keywords):
                    ai_reply = random.choice(sad_responses)
                elif any(word in user_message for word in work_keywords):
                    ai_reply = random.choice(work_responses)
                elif any(word in user_message for word in relationship_keywords):
                    ai_reply = random.choice(relationship_responses)
                elif any(word in user_message for word in question_keywords):
                    ai_reply = random.choice(question_responses)
                else:
                    ai_reply = random.choice(default_responses)
            else:
                if any(word in user_message for word in stress_keywords):
                    ai_reply = random.choice(stress_responses)
                elif any(word in user_message for word in sad_keywords):
                    ai_reply = random.choice(sad_responses)
                elif any(word in user_message for word in work_keywords):
                    ai_reply = random.choice(work_responses)
                elif any(word in user_message for word in relationship_keywords):
                    ai_reply = random.choice(relationship_responses)
                elif any(word in user_message for word in question_keywords):
                    ai_reply = random.choice(question_responses)
                else:
                    ai_reply = random.choice(followup_responses)
        
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