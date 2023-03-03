from fastapi import FastAPI
from pydantic import BaseModel

# Define a Pydantic model for your input data
class Item(BaseModel):
    message: str

# Create a FastAPI app instance
app = FastAPI()

# Define a route and a function to handle requests to that route
@app.post("/items")
async def create_item(item: Item):
    print(item.message)
    return "item_dict"

@app.get("/itemsTwo")
async def create_item(item: Item):
    return "item_dict"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)