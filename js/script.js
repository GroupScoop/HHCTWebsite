Parse.initialize("yHhyuhFXyXMwEy2HqMxMCZiBFjeYg8UGzTwBrgN9", "G1Xtoi23QsrBXGj5SmelICC4OATSYYsAiucA7Smk");
var QueryString = function() {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], pair[1]];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
}();
if ($("body").hasClass("home"))
  $(document).ready(function() {
    var classCode = "1337";

    var Users = Parse.Object.extend("Users");
    var user = new Users();

    $("#login").submit(function(e) {
      e.preventDefault();
      var fullName = $("[name=name]").val();
      var classCode = $("[name=code]").val();
      user.set("name", fullName);
      user.set("classCode", parseInt(classCode));
      user.save(null, {
        success: function(user) {
          var Classes = Parse.Object.extend("Classes");
          var query = new Parse.Query(Classes);
          query.equalTo("classCode", parseInt(classCode));
          query.find({
            success: function(classes) {
              document.location = "confirm.html?teacher=" + classes[0]["attributes"]["teacherName"] + "&classCode=" + classCode;
              // The object was retrieved successfully.
            },
            error: function(object, error) {
              console.log(object, error)
              // The object was not retrieved successfully.
              // error is a Parse.Error with an error code and message.
            }
          });
        },
        error: function(user, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });

    });
  });
if ($("body").hasClass("selectpeople"))
  $(document).ready(function() {
    var Users = Parse.Object.extend("Users");
    var query = new Parse.Query(Users);
    query.find({
      success: function(users) {
        for (var i = 0; i < users.length - 1; i++) {
          var user = users[i];
          $("ul").append('<li><div class="checkbox" val="' + user["id"] + '"><span class="num">&nbsp;</span></div> ' + user["attributes"]["name"] + '</li>');
        }
      },
      error: function(object, error) {
        console.log(object, error)
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  });
if ($("body").hasClass("confirm"))
  $(document).ready(function() {
    $("#teacher").html(decodeURIComponent(QueryString.teacher));
  });
var choices = [];
$(document).on("click", ".checkbox", function() {
  if ($(this).hasClass("checked")) {
    $(this).removeClass("checked");
    $(this).find(".num").html("&nbsp;");
    choices = choices.remByVal($(this).attr("val"));
    for (var i = 0; i < choices.length; i++) {
      var choice = choices[i];
      choice.elem.find(".num").html(i + 1);
    }
  } else {
    if (choices.length == 3)
      return;
    choices.push({
      elem: $(this),
      value: $(this).attr("val")
    });
    $(this).find(".num").html(choices.length);
    $(this).addClass("checked");
  }
});

Array.prototype.remByVal = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].value === val) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}
$("#confirm").click(function(e) {
  e.preventDefault();
  document.location = "choose.html?teacher=" + QueryString.teacher + "&classCode=" + QueryString.classCode;
});
$("#choose").click(function() {
  var peeps = [];
  for (var i = 0; i < choices.length; i++) {
    peeps.push(choices[i]["value"])
  }
  document.location = "wait.html?teacher=" + QueryString.teacher + "&classCode=" + QueryString.classCode + "&choices=" + peeps.join();

})
$("#retry").click(function() {
  var Classes = Parse.Object.extend("Classes");
  var query = new Parse.Query(Classes);
  query.equalTo("classCode", parseInt(QueryString.classCode));
  query.find({
    success: function(classes) {
      console.log(classes);
      if (classes[0]["attributes"].ready)
        document.location = "group.html?teacher=" + QueryString.teacher + "&classCode=" + QueryString.classCode + "&choices=" + QueryString.choices;
      // The object was retrieved successfully.
    },
    error: function(object, error) {
      console.log(object, error)
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
});
var allUsers;
var Users = Parse.Object.extend("Users");
var query = new Parse.Query(Users);
query.find({
  success: function(users) {
    allUsers = users
  }
});
if ($("body").hasClass("find"))
  $(document).ready(function() {
    var people = QueryString.choices.split(",");
    var Users = Parse.Object.extend("Users");
    var query = new Parse.Query(Users);
    query.containedIn("objectId", people);

    query.find({
      success: function(users) {
        for (var i = 0; i < users.length - 1; i++) {
          var user = users[i];
          if (user["attributes"]["taken"]) {
            user = allUsers[Math.floor(Math.random() * allUsers.length)];
            var j = 0;
            while (people.contains(user.id) && j < 100) {
              j++;
              user = allUsers[Math.floor(Math.random() * allUsers.length)];
            }
          }
          
          user.set("taken", true);
          user.save();
          $(".content").append('<div class="member">' + user["attributes"]["name"] + '</div>');
        }
      },
      error: function(object, error) {
        console.log(object, error)
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  });
$("#ready-up").click(function() {
  var classCode = $("#class").html();
  var Classes = Parse.Object.extend("Classes");
  var query = new Parse.Query(Classes);
  query.equalTo("classCode", parseInt(classCode));
  query.find({
    success: function(classes) {
      console.log(classes);
      classes[0].set("ready", true);
      classes[0].save({
        success: function(classes) {
          console.log($("#ready-up"));
          $("#ready-up").attr("disabled", true);
        }
      })
    },
    error: function(object, error) {
      console.log(object, error)

      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
});
$("#reset").click(function() {
  var classCode = $("#class").html();
  var Classes = Parse.Object.extend("Classes");
  var query = new Parse.Query(Classes);
  query.equalTo("classCode", parseInt(classCode));
  query.find({
    success: function(classes) {
      console.log(classes);
      classes[0].set("ready", false);
      classes[0].save({
        success: function(classes) {
          console.log($("#ready-up"));
          
          for (var i = 0; i < allUsers.length; i++) {
            allUsers[i].set("taken", false);
            allUsers[i].save();
            location.reload();
          }
        }
      })
    },
    error: function(object, error) {
      console.log(object, error)

      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
});
$("#signin").click(function(e) {
  e.preventDefault();
  var teacher = $("[name=teacher]").val();
  var password = $("[name=password]").val();
  var Classes = Parse.Object.extend("Classes");
  var query = new Parse.Query(Classes);
  query.equalTo("teacherName", teacher);
  query.find({
    success: function(classes) {
      console.log(classes);
      if (classes.length == 0) {
        var classes = new Classes();
      classes.set("teacherName", teacher);
      classes.set("classCode", Math.floor(Math.random() * 90000) + 10000);
      console.log(classes)
      classes.save({
        success: function(classes) {
          console.log(classes)
          $("button").attr("disabled", false);
          $("#class").html(classes["attributes"]["classCode"]);
        },
        error: function(object, error) {
          console.log(object, error)
        }
      })
      } else {
        $("button").attr("disabled", false);
        $("#class").html(classes[0]["attributes"]["classCode"]);
      }
    },
    error: function(object, error) {
      console.log(object, error)

      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
});