from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

expenses =[
  {
    "id": 1,
    "name": "Rent",
    "amount": 25000
  },
  {
    "id": 2,
    "name": "Groceries",
    "amount": 8500
  },
  {
    "id": 3,
    "name": "Electricity (Kenya Power)",
    "amount": 3200
  },
  {
    "id": 4,
    "name": "Water Bill",
    "amount": 800
  },
  {
    "id": 5,
    "name": "Internet (WiFi)",
    "amount": 3000
  },
  {
    "id": 6,
    "name": "Transport / Fuel",
    "amount": 6500
  },
  {
    "id": 7,
    "name": "Airtime and Data",
    "amount": 1500
  }

]

@app.route("/api/expenses", methods=["GET"])
def get_expenses():
    return jsonify(expenses)

@app.route("/api/expenses", methods =["POST"])
def add_expense():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    amount = data.get("amount")

    if name == "":
        return jsonify({"error": "Name is required"}), 400
    if not isinstance(amount, (int, float)) or amount <=0:
        return jsonify({"error": "amount must be a number greater than 0"}), 400

    new_expense = {
        "id":max([ex["id"] for ex in expenses], default= 0)+1,
        "name": name,
        "amount": amount
    }
    expenses.append(new_expense)
    return jsonify(new_expense), 201

@app.route("/api/expenses/<int:expense_id>", methods = ["PATCH"])
def update_expense(expense_id):
    data = request.get_json(silent=True) or {}
    for expense in expenses:
        if expense ["id"] == expense_id:
            if "name" in data:
                expense["name"] = data["name"]
            if "amount" in data:
                expense["amount"] = data["amount"]
            return jsonify(expense)
    return jsonify({"error": "Expense not found"}), 404


@app.route("/api/expenses/<int:expense_id>", methods= ["DELETE"])
def delete_expenses(expense_id):
    for expense in expenses:
        if expense["id"] == expense_id:
            expenses.remove(expense)
            return "", 204
    return jsonify({"error": "expense not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)