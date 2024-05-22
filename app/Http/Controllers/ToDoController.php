<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;
use Illuminate\Support\Facades\DB;

class ToDoController extends Controller
{

    private $recordCount; 

    public function __construct()
    {
        $this->recordCount = DB::table('todos')
            ->where('created_at', '>=', now()->startOfDay())
            ->where('created_at', '<=', now()->endOfDay())
            ->count();
    }

    public function index()
    {
        return [
            'record_count' => $this->recordCount,
            'todos' => Todo::all()
        ];
    }
 
    public function show($id)
    {
        return Todo::find($id);
    }

    public function store(Request $request)
    {
        // $request->validate([
        //     'title'=>'required',
        //     'description'=>'required'
        // ])
        // return Todo::create($request->all());

        if ($this->recordCount <= 20) {
            try{
                Todo::create($request->all());
                return response()->json([
                    'message'=>'ToDoo Created Successfully!!',
                ]);
            }catch(\Exception $e){
                \Log::error($e->getMessage());
                return response()->json([
                    'message'=>'Something goes wrong while creating a todo!!'
                ],500);
            }
        } else {
            return response()->json(['message' => 'Previše zapisa dodano danas (There\'s no more place for any record) '.'('.$recordCount.')'], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->update($request->all());

        return $todo;
    }

    public function delete(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        return 204;
    }
}








// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Product extends Model {

//    use HasFactory;

//    protected $fillable = ['title', 'description', 'image'];
// }

//php tag here
// <!-- Next, Open ProductController.php and add code in index, store, show, update, and delete functions as a following: -->

//php tag here
// namespace App\Http\Controllers;

// use App\Models\Product;
// use Illuminate\Http\Request;

// use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Storage;
// use Carbon\Carbon;

// class ProductController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      *
//      * @return \Illuminate\Http\Response
//      */
//     public function index()
//     {
//         return Product::select('id','title','description','image')->get();
//     }

//     /**
//      * Store a newly created resource in storage.
//      *
//      * @param  \Illuminate\Http\Request  $request
//      * @return \Illuminate\Http\Response
//      */
//     public function store(Request $request)
//     {
//         $request->validate([
//             'title'=>'required',
//             'description'=>'required',
//             'image'=>'required|image'
//         ]);

//         try{
//             $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
//             Storage::disk('public')->putFileAs('product/image', $request->image,$imageName);
//             Product::create($request->post()+['image'=>$imageName]);

//             return response()->json([
//                 'message'=>'Product Created Successfully!!'
//             ]);
//         }catch(\Exception $e){
//             \Log::error($e->getMessage());
//             return response()->json([
//                 'message'=>'Something goes wrong while creating a product!!'
//             ],500);
//         }
//     }

//     /**
//      * Display the specified resource.
//      *
//      * @param  \App\Models\Product  $product
//      * @return \Illuminate\Http\Response
//      */
//     public function show(Product $product)
//     {
//         return response()->json([
//             'product'=>$product
//         ]);
//     }

//     /**
//      * Update the specified resource in storage.
//      *
//      * @param  \Illuminate\Http\Request  $request
//      * @param  \App\Models\Product  $product
//      * @return \Illuminate\Http\Response
//      */
//     public function update(Request $request, Product $product)
//     {
//         $request->validate([
//             'title'=>'required',
//             'description'=>'required',
//             'image'=>'nullable'
//         ]);

//         try{

//             $product->fill($request->post())->update();

//             if($request->hasFile('image')){

//                 // remove old image
//                 if($product->image){
//                     $exists = Storage::disk('public')->exists("product/image/{$product->image}");
//                     if($exists){
//                         Storage::disk('public')->delete("product/image/{$product->image}");
//                     }
//                 }

//                 $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
//                 Storage::disk('public')->putFileAs('product/image', $request->image,$imageName);
//                 $product->image = $imageName;
//                 $product->save();
//             }

//             return response()->json([
//                 'message'=>'Product Updated Successfully!!'
//             ]);

//         }catch(\Exception $e){
//             \Log::error($e->getMessage());
//             return response()->json([
//                 'message'=>'Something goes wrong while updating a product!!'
//             ],500);
//         }
//     }

//     /**
//      * Remove the specified resource from storage.
//      *
//      * @param  \App\Models\Product  $product
//      * @return \Illuminate\Http\Response
//      */
//     public function destroy(Product $product)
//     {
//         try {

//             if($product->image){
//                 $exists = Storage::disk('public')->exists("product/image/{$product->image}");
//                 if($exists){
//                     Storage::disk('public')->delete("product/image/{$product->image}");
//                 }
//             }

//             $product->delete();

//             return response()->json([
//                 'message'=>'Product Deleted Successfully!!'
//             ]);
            
//         } catch (\Exception $e) {
//             \Log::error($e->getMessage());
//             return response()->json([
//                 'message'=>'Something goes wrong while deleting a product!!'
//             ]);
//         }
//     }
// }

