var budgetController = (function () {
  // Data types for expenses and incomes
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    allTotals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, ID;

      //ID = lastID + 1
      //create new ID
      if (data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new Item based on inc or exp type
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      //Add in the new item
      data.allItems[type].push(newItem);

      //return the new Element
      return newItem;
    },
    testing: function(){
      console.log(data);
    }
  };
})();

var UIController = (function() {
  // Class names
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    outputIncList: '.income__list',
    outputExpList: '.expenses__list'
  }

  return {
    //Getting the input from the input areas UI
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be 'inc' or 'exp'
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },

    // adding an item to the list ui
    addListItem: function(obj, type){
      var html, newHTML;
      //create HTML string with placeholder text
      if (type === 'inc'){
        html = `
        <div class="item clearfix" id="income-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
                <div class="item__value">+ $%value%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>
        `
      } else if (type === 'exp') {
          html = `
          <div class="item clearfix" id="expense-%id%">
              <div class="item__description">%description%</div>
              <div class="right clearfix">
                  <div class="item__value">- $%value%</div>
                  <div class="item__percentage">21%</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>
          `
      }

      //replace placeholder text with actual Data
      newHTML = html.replace('%id%',obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      //insert HTML into the DOM
      if (type === 'inc'){
        document.querySelector(DOMStrings.outputIncList).insertAdjacentHTML('beforeend',newHTML);
      } if (type === 'exp') {
        document.querySelector(DOMStrings.outputExpList).insertAdjacentHTML('beforeend',newHTML);
      }
    },

    //Accessing the DOM strings
    getDOMStrings: function() {
      return DOMStrings;
    }
  }
})();

var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    //Event listeners
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keycode === 13 || event.which == 13) {
        ctrlAddItem();
      }
    });
  };



  //functions
  var ctrlAddItem = function() {
    var input, newItem;

    // Get input data
    input = UICtrl.getInput();

    // Add new item to data structute
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // Add new item to UI
    UICtrl.addListItem(newItem, input.type);

    // calculate budget


    // Update UI

  };

  return {
    init: function() {
      setupEventListeners();
    },
  }


})(budgetController, UIController);

controller.init();
