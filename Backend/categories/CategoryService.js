const Category=require('./Category')

class CategoryService{
    static async addCategory(category){
        try{

            const catg=new Category(category);
            return await catg.save();
        }catch (e){
            console.error('Error in addCategory:', e.message);
            throw e;
        }
    }
    static async deleteCategoryById(id){
        try {
            return await Category.deleteOne({_id:id})
        }catch (e){
            console.error('Error in deleteCategory:', e.message);
            throw e;
        }
    }
    static async getAll(){
        try {
            return await Category.find()
        }catch (e){
            console.error('Error in getAllCategory:', e.message);
            throw e;
        }
    }
}
module.exports = CategoryService;