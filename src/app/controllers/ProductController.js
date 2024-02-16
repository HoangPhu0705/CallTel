const ProductService = require("../service/ProductService");

class ProductController{
    async searchByName(req,res){
        const searchText = req.query.name;
        const products = await ProductService.searchByName(searchText);
        if (products) {
            res.status(200).json({data : products});
        }else{
            res.status(400).json({error : "not found list"});
        }
    }
    async getProductById(req,res){
        const id = req.params.id;
        const product = await ProductService.getProductById(id);
        if (product) {
            res.status(200).json({data : product});
        }else{
            res.status(400).json({error : "not found product"});
        }
    }
}

module.exports = new ProductController;