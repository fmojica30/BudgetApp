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

  var Data = {
    allItems: {
      exp: [],
      inc: []
    },
    allTotals: {
      exp: 0,
      inc: 0
    }
  }



})();

var UIController = (function() {
  // Class names
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
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
    // Get input data
    var input = UICtrl.getInput();
    console.log(input);
    // Add new item to data structute

    // Add new item to UI

    // calculate budget

    // Update UI
  }

  return {
    init: function() {
      setupEventListeners();
    },
  }


})(budgetController, UIController);

controller.init();
