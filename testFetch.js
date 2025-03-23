fetch("http://localhost:4002/api/products/67d91a68b1de02f4b0e31ef3")
  .then(response => response.json())
  .then(data => console.log("Product data:", data))
  .catch(error => console.error("Fetch error:", error));
