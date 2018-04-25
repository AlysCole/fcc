var recipeBoxStorage = "_recipe_box_recipes";
var RecipeList = React.createClass({
  loadRecipesFromStorage: function() {
    var recipes = JSON.parse(localStorage.getItem(recipeBoxStorage));
    this.setState({"data": recipes});
    return {"data": recipes};
  },
  getInitialState: function() {
    return this.loadRecipesFromStorage();
  },
  handleAddRecipe: function(e) {
    $(".recipeForm").slideToggle();
  },
  render: function() {
    var recipeNodes = this.state.data.map(function(recipe) {
      return (
        <UserRecipe recipeName={recipe.name} recipe={recipe.ingredients} />
      )
    });
    return (
      <div className="recipeList">
        {recipeNodes}
        <input type="button" value="Add Recipe" className="submit-button" onClick={this.handleAddRecipe} />
        <AddRecipe onSubmitRecipe={this.loadRecipesFromStorage} />
      </div>
    );
  }
});

var AddRecipe = React.createClass({
  getInitialState: function() {
    return {
      name: "",
      ingredients: ""
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var ingredients = this.state.ingredients.split(","), name = this.state.name,
        storageRecipes = JSON.parse(localStorage.getItem(recipeBoxStorage));
    storageRecipes.push({'name': name, 'ingredients': ingredients});
    console.log(storageRecipes);
    localStorage.setItem(recipeBoxStorage, JSON.stringify(storageRecipes));
    this.setState({
      name: '',
      ingredients: ''
    });
    this.props.onSubmitRecipe();
  },
  handleRecipeChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleIngredientsChange: function(e) {
    this.setState({ingredients: e.target.value});
  },
  render: function() {
    return (
      <div className="addRecipe">
       <form className="recipeForm" onSubmit={this.handleSubmit}>
          <label><b>Recipe</b>
          <input type="text" value={this.state.name} onChange={this.handleRecipeChange} placeholder="Recipe name" />
          </label>
          <label><b>Ingredients</b>
          <textarea placeholder="Separate the ingredients by a comma (,)." onChange={this.handleIngredientsChange} value={this.state.ingredients}></textarea></label>
          <input type="submit" className="submit-button" id="recipe-submit" value="Submit" />
        </form>
      </div>
    );
  }
})

var UserRecipe = React.createClass({
  handleClick: function(e) {
    $(e.target).parent().children('.userRecipeDetails').slideToggle();
    // var recipe = JSON.parse(localStorage.getItem("_recipe_box_" + e.target.value));
  },
  render: function() {
    return (
      <div className="userRecipe">
        <input type="button" className="recipeName" onClick={this.handleClick} value={this.props.recipeName} />
        <UserRecipeDetails ingredients={this.props.recipe} />
      </div>
    )
  }
});

var UserRecipeDetails = React.createClass({
  render: function() {
    var ingredientNodes = this.props.ingredients.map(function(ingredient) {
      return (
        <span className="ingredient">{ingredient}</span>
      );
    });
    return (
      <div className="userRecipeDetails">
        <h2 className="ingredientsHeader">Ingredients</h2>
        {ingredientNodes}
      </div>
    )
  }
});

var recipes = [ 
  {name: "Pie",
   ingredients: ["Flour", "Sugar"]},
  {name: "Mashed Potato",
   ingredients: ["Potato", "Butter"]},
];

if (!localStorage.getItem(recipeBoxStorage))
  localStorage.setItem(recipeBoxStorage, JSON.stringify(recipes));


ReactDOM.render(
  <RecipeList />,
  document.getElementById('recipe-box')
)

