/* global jQuery */
var API_PUBLIC =  "http://127.0.0.1:8080";

  (function($){

    $.urlParam = function(name){
      var results = new RegExp(`[\?&] + ${name} + =([^&#]*)`).exec(window.location.href);
      try {
        return results[1] || 0;
      } catch (e) {
        $("#btnLogin").hide();
        $("#btnClose").show();
        $("#modalContent").text("Insufficient data")
        $('#exampleModal').modal()
      }
    }

  $("#btn-login" ).click(() => {
    if($.required($("#temporalPassword")) && $.required($("#password")) && $.required($("#repeatPassword"))){
        let params = {
          token: $.urlParam('token'),
          userId: $.urlParam('id'),
          temporalPassword: $('#temporalPassword').val(),
          password: $('#password').val(),
          repeatPassword: $('#repeatPassword').val()
        };

        $.ajax({
          url: `${API_PUBLIC}/password/changePassword `,
          data: params,
          type: 'POST',

          success:data => {
            if(data.error){
              $("#btnLogin").hide();
              $("#btnClose").show();
              $("#modalLabel").text("Attention! ")
              $("#modalContent").text(`An error has occurred: ${data.error.text}`)
              $('#exampleModal').modal()
            }else{

              $("#btnLogin").show();
              $("#btnClose").hide();
              $("#modalLabel").text("Satisfactory process! ")
              $("#modalContent").text("Return the login")
              $('#exampleModal').modal()
            }
          },
          error (e) {
            $("#btnLogin").hide();
            $("#btnClose").show();
            $("#modalLabel").text("Attention! ")
            $("#modalContent").text(`An error has occurred. Code error ${e.status}`)
            $('#exampleModal').modal()
          }
        });
      }
    });


    $.required = function(element){
      var ban = true
      if($(element).val() === ''){
        $(element).parent().addClass("has-error")
        ban = false;
      }else {
        $(element).parent().removeClass("has-error")
      }
      return ban;
    }

})(jQuery);
