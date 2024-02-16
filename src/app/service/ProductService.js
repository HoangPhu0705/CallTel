const Product = require("../models/Product");

class ProductService {
  async getAll(page, limit) {
    try {
      const products = await Product.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          isActive: i === page,
        });
      }
      return {
        products,
        pagination: {
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          pages: pages
        },
      };
    } catch (err) {
      console.log("find fail : ", err.message);
      return null;
    }
  }

  async create(newProduct) {
    Product.create(newProduct)
      .then((product) => {
        console.log("New staff product created:", product._id);
        return product;
      })
      .catch((error) => {
        console.error("Error creating new product member:", error.message);
      });
  }
  async remove(id) {
    try {
      const deletedProduct = await Product.findByIdAndRemove(id);
      if (deletedProduct) {
        console.log("Product deleted successfully");
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
  async updateProduct(productId, updateFields) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateFields,
        {
          new: true, // Return the modified product
          runValidators: true, // Validate the update against the schema
        }
      );

      if (!updatedProduct) {
        return { success: false, message: "Product not found" };
      }
      return { success: true, updatedProduct };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.error("Error finding product by ID:", error);
      throw error;
    }
  }
  async searchByName(name) {
    try {
      const products = await Product.find({
        productName: { $regex: new RegExp(name, "i") },
      }).exec();
      return products;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async createdByList(listProduct) {
    for (const product of listProduct) {
      console.log(product.productName);
      try {
        await Product.create(product);
      } catch (error) {
        console.error(
          `Error inserting staff: ${product.productName}`,
          error.message
        );
        continue;
      }
    }
  }

  async countAll() {
    try {
      const count = await Product.countDocuments();
      return count;
    } catch (err) {
      console.log("count fail : ", err.message);
      return null;
    }
  }
}
module.exports = new ProductService();
