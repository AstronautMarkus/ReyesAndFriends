from flask import jsonify, request, render_template
import os
from dotenv import load_dotenv
from flask_mail import Message
from . import contact
from app.utils.post_mongo_connection import insert_to_mongo
from app import mail 

load_dotenv()

mail_username = os.getenv("MAIL_USERNAME")

if not mail_username:
    raise RuntimeError("MAIL_USERNAME is not set in the environment variables.")

@contact.route('', methods=['POST'])
def postContact():
    try:
        data = request.get_json()

        required_fields = ["first_name", "last_name", "cellphone", "email", "category", "message"]
        errors = {field: "es requerido." for field in required_fields if field not in data or not data[field]}

        if errors:
            return jsonify(errors), 422

        insert_to_mongo("contact_forms", data)

        user_name = f"{data['first_name']} {data['last_name']}"
        email_html = render_template(
            'emails/contact-success.html',
            user_name=user_name,
            cellphone=data['cellphone'],
            email=data['email'],
            category=data['category'],
            message=data['message']
        )

        msg = Message(
            subject="Solicitud de contacto recibida",
            sender=mail_username,
            recipients=[data['email']],
            html=email_html
        )
        
        mail.send(msg)

        return jsonify({
            "message": "¡Gracias por contactarnos! Dentro de poco recibirás un correo de confirmación sobre tu solicitud.",
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
