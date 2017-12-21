var model = {
    activeCat: null,
    adminDisplay: null,
    cats:  [
        {
            name: "Cat 1",
            image: "cat_picture1.jpg",
            clickCount: 0
        },
        {
            name: "Cat 2",
            image: "cat_picture2.jpeg",
            clickCount: 0
        },
        {
            name: "Cat 3",
            image: "cat_picture3.jpeg",
            clickCount: 0
        },
        {
            name: "Cat 4",
            image: "cat_picture4.jpeg",
            clickCount: 0
        }
    ]
};

var controller = {
    init: function(){
        model.activeCat = model.cats[0];

        listView.init();
        catView.init();
        adminView.init();
    },
    getCurrentCat: function(){
        return model.activeCat;
    },
    getCats: function(){
        return model.cats;
    },
    setCurrentCat: function(cat){
        model.activeCat = cat;
    },
    incrementClickCount: function(){
        model.activeCat.clickCount ++;
        catView.renderCat();
        adminView.render();
    },
    changeAdminDisplay: function(){
        model.adminDisplay = !model.adminDisplay;
    },
    getAdminDisplay: function(){
        return model.adminDisplay;
    },
    updateCatInfo: function(name, img, clicks){
        var cat = this.getCurrentCat();
        cat.name = name;
        cat.image = img;
        cat.clickCount = clicks;

        adminView.render();
        listView.renderList();
        catView.renderCat();
    }

};

var listView = {
    init: function(){
        this.catList = document.getElementById("cats-list");
        this.renderList();
    },
    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();

        // empty the cat list
        this.catListElem.innerHTML = '';

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    },
    renderList: function(){
        var cat, elem, i;
        var catList = document.getElementById("cats-list");
        var cats = controller.getCats();

        // empty the cat list
        catList.innerHTML = '';

        for(i = 0; i < cats.length; i++){

            cat = cats[i];

            elem = document.createElement('p');
            elem.textContent = cat.name;

            $("#cats-list").append('<p></p>');

            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    controller.setCurrentCat(catCopy);
                    catView.renderCat();
                    adminView.render();
                };
            })(cat));

//                $('p').on("click", (function(cat) {
//                    return function() {
//                        controller.setCurrentCat(cat);
//                        catView.renderCat();
//                        console.log(cat);
//                    };
//                })(cat));

            // create the list
            catList.appendChild(elem);
//                elem = $('<p class="cat">' + cat.name+ '</p>').appendTo("#cat-list");

        }
    }
};

var catView = {
    init: function(){

        $("#cat-img").on("click", function(){
            controller.incrementClickCount();
        });

        // using 'this' means you only grab the variable once and not every time the function is called
        this.catCount = $('#cat-counter');
        this.catName = $('#cat-name');
        this.catImg = $('#cat-img');
        this.renderCat();
    },
    renderCat: function(){
        var currentCat = controller.getCurrentCat();

        this.catCount.html(currentCat.clickCount);
        this.catName.html(currentCat.name);
        this.catImg.attr("src", currentCat.image);
    }
};

var adminView = {
    init: function(){
        model.adminDisplay = false;

        $("#admin-button").on("click", function(){
            controller.changeAdminDisplay();
            adminView.render();
        });

        $("#cancel").on("click", function(){
            controller.changeAdminDisplay();
            adminView.render();
        });
        $("#save").on("click", function(){

            var name = $("#name").val();
            var image = $("#image").val();
            var click = $("#clickCount").val();

            controller.updateCatInfo(name,image,click);

        });

        this.render();
    },
    render: function(){
        if(controller.getAdminDisplay()){
            $("#admin-display").show();
            var currentCat = controller.getCurrentCat();

            $("#name").val(currentCat.name);
            $("#image").val(currentCat.image);
            $("#clickCount").val(currentCat.clickCount);

        } else {
            $("#admin-display").hide();
        }
    }
}

controller.init();