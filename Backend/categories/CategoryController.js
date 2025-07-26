const CategoryService=require('./CategoryService')

class CategoryController{
    static async getAll(req,res){
        try {
            const catgs= await CategoryService.getAll()
            res.send(catgs);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addCategory(req,res){
        try {
            const { name } = req.body;
            const category= CategoryService.addCategory({name})
            res.status(201).json({message: "Category added successfully "+name});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteCatgById(req,res){
        try {
            const id = req.params.id;
            await CategoryService.deleteCategoryById(id)
            res.status(201).json({
                message: "Category "+id+" has been deleted successfully"});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports=CategoryController