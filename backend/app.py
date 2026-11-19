from flask import Flask, jsonify, request
from flask_cors import CORS

import os
import sqlite3

DB_FILE = os.path.join(os.path.dirname(__file__), "expense.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row

    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS expense(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT,
          date TEXT
        )
    """)
    conn.commit()
    conn.close()


def seed_db():
    conn = get_db()
    count = conn.execute("SELECT COUNT(*) FROM expense").fetchone()[0]
    if count == 0:
        conn.executemany(
            "INSERT INTO expense (name, amount) VALUES (?, ?)",
            [("Rent", 25000), ("Groceries", 8500), ("Water bill", 800)]
        )
        conn.commit()
    conn.close()

init_db()
seed_db()

app = Flask(__name__)
CORS(app)


@app.route("/api/expenses", methods=["GET"])
def get_expenses():
    conn = get_db()
    rows = conn.execute("SELECT * FROM expense").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/api/expenses", methods =["POST"])
def add_expense():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    amount = data.get("amount")

    if name == "":
        return jsonify({"error": "Name is required"}), 400
    if not isinstance(amount, (int, float)) or amount <=0:
        return jsonify({"error": "amount must be a number greater than 0"}), 400

    conn = get_db() 
    cursor = conn.execute("INSERT INTO expense (name, amount) VALUES (?,?)", (name, amount))
    conn.commit()

    new_expense_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": new_expense_id,
        "name": name,
        "amount": amount
        }), 201
    

    # new_expense = {
    #     "id":max([ex["id"] for ex in expenses], default= 0)+1,
    #     "name": name,
    #     "amount": amount
    # }
    # expenses.append(new_expense)
    # return jsonify(new_expense), 201

@app.route("/api/expenses/<int:expense_id>", methods=["PATCH"])
def update_expense(expense_id):
    data = request.get_json(silent=True) or {}

    fields = []
    values = []

    if "name" in data:
        name = str(data["name"]).strip()
        if name == "":
            return jsonify({"error": "Name can't be empty"}), 400
        fields.append("name = ?")
        values.append(name)

    if "amount" in data:
        amount = data["amount"]
        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({"error": "Amount must be a number greater than 0"}), 400
        fields.append("amount = ?")
        values.append(amount)

    if "category" in data:
        fields.append("category = ?")
        values.append(data["category"])

    if not fields:
        return jsonify({"error": "No valid fields provided for update"}), 400

    conn = get_db()
    existing = conn.execute("SELECT * FROM expense WHERE id = ?", (expense_id,)).fetchone()
    if existing is None:
        conn.close()
        return jsonify({"error": "Expense not found"}), 404

    values.append(expense_id)
    query = f"UPDATE expense SET {', '.join(fields)} WHERE id = ?"
    conn.execute(query, values)
    conn.commit()

    updated = conn.execute("SELECT * FROM expense WHERE id = ?", (expense_id,)).fetchone()
    conn.close()

    return jsonify(dict(updated)), 200
# @app.route("/api/expenses/<int:expense_id>", methods = ["PATCH"])
# def update_expense(expense_id):
#     data = request.get_json(silent=True) or {}

#     if not data:
#         return jsonify({"error": "Expense not found"}), 404

#     conn = get_db()

#     # check if te expense exists
#     existing = conn.execute ("SELECT * FROM expense WHERE id = ?", (expense_id,)). fetchone()
#     if not existing:
#         conn.close()
#         return jsonify({"error": "Expense not found"}), 404

#     # dynamically build the SQL based on what field were sent
#     fields = []
#     values = []

#     # check what allowed columns  are present in the incoming JSON
#     for key in ["name", "amount", "category"]:
#         if key in data:
#             fields. append(f"{key} = ?")
#             values.append(data[key])

#     if not fields : 
#         conn.close()
#         return jsonify({"error": "No valid fields provided for update"}), 400
    
#     values.append(expense_id)
#     query = f"UPDATE expenses SET {', '.join(fields)} WHERE id = ?"

#     conn.execute(query, values)
#     conn.commit()

#     update_row = conn.execute("SELECT * FROM expense WHERE id = ?", (expense_id,)).fetchone()
#     conn.close()

#     return jsonify(dict(update_row)), 200
    
#     # for expense in expenses:
#     #     if expense ["id"] == expense_id:
#     #         if "name" in data:
#     #             expense["name"] = data["name"]
#     #         if "amount" in data:
#     #             expense["amount"] = data["amount"]
#     #         return jsonify(expense)
    


@app.route("/api/expenses/<int:expense_id>", methods= ["DELETE"])
def delete_expenses(expense_id):
    conn = get_db();
    cursor = conn.execute("DELETE FROM expense WHERE id = ?", (expense_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    # check if anything was deleted
    if deleted == 0:
        return({"error": "Expense not found"}), 404
    return "", 204
    # for expense in expenses:
    #     if expense["id"] == expense_id:
    #         expenses.remove(expense)
    #         return "", 204
    # return jsonify({"error": "expense not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)