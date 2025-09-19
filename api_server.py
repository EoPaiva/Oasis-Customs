# api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

# Usaremos o mesmo arquivo de banco de dados do bot
DATABASE_FILE = "atendimento.db"

app = Flask(__name__)
CORS(app) # Permite que seu site se comunique com esta API

def init_sales_db():
    """Garante que a tabela de vendas da calculadora exista."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS calculator_sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendedor_nome TEXT NOT NULL,
            item_vendido TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            preco_total REAL NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/venda', methods=['POST'])
def registrar_venda():
    """Endpoint para receber e salvar os dados da venda."""
    data = request.json
    print(f"API: Nova venda recebida -> {data}")

    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO calculator_sales (vendedor_nome, item_vendido, quantidade, preco_total, timestamp) VALUES (?, ?, ?, ?, ?)",
            (
                data.get('vendedorNome', 'Não informado'),
                data.get('itemVendido', 'Venda Geral'),
                int(data.get('quantidade', 1)),
                float(data.get('precoTotal', 0)),
                datetime.now().isoformat()
            )
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "sucesso", "mensagem": "Venda registrada!"})
    except Exception as e:
        print(f"API ERRO: Falha ao salvar no banco de dados: {e}")
        return jsonify({"status": "erro", "mensagem": "Erro interno do servidor"}), 500

if __name__ == '__main__':
    init_sales_db()
    # Usar 0.0.0.0 torna a API acessível na sua rede local
    app.run(host='0.0.0.0', port=5000)