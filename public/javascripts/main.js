

jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
                .parent()
                .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
    });

});


// Index ============================================
$(document).ready(function () {
    $('div.fb-cards-designs').each(function () {
        $(this).find('i.fas').click(()=>{
            $(this).find('div.panel-options').toggle()
        })
    });

    $("a.deletePost").click(function(e) {
        e.preventDefault()
        let postId = $(this).closest("div.fb-cards-designs").find("div.postId").text()
        $.ajax({
            type: "delete",
            url: "/post/"+postId,
            data: {
                "id": postId
            },
            success: (data) => {
               $(this).closest("div.fb-cards-designs").remove()
          
               $("div.alert-success").toggle()
              
               setTimeout(function(){ $("div.alert-success").toggle() },3000);
            }
        });
        
    })
})

function postStatus(){
    let content =  $("#content").val()
    let userId = $("#id-user").val()
    let name = $("a.info-name").text()

    $.ajax({
        type: "POST",
        url: "/post",
        data: {
            "content": content,
            "user_id": userId
        },
        success: (data) => {
            // let json = data.data
            // console.log(data)
            let post = `
                <div class="fb-cards-designs">
                    <div class="fb-clone-card">
                        <div class="fb-card-main-content">
                            <div class="fb-card-header">
                                <div class="user-post-info">
                                    <div class="user-thumb">
                                        <img src="https://randomuser.me/api/portraits/men/94.jpg" class="img-responsive" />
                                    </div>
                                    <div class="user-information">
                                        <a href="">
                                            <p>${name}</p>
                                        </a>
                                        <small>Now</small>
                                    </div>
                                </div>
                                <div class="post-action">
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>
                            </div>

                            <div class="fb-card-body simple-text-card simple-image-card">
                                <p>${content}</p>
                                <div class="images-container">
                                    <img src="" class="img-responsive" />
                                </div>
                            </div>

                        </div>

                        <div class="fb-card-like-comment-holder">
                            <div class="fb-card-like-comment">
                                <div class="likes-emoji-holder">
                                    <span>0 Likes</span>
                                </div>
                                <div class="like-comment-holder">
                                    <span>0 Commnets</span>
                                </div>
                            </div>
                        </div>

                        <div class="fb-card-actions-holder">
                            <div class="fb-card-actions">
                                <div class="fb-btn-holder">
                                    <a href="#"><i class="far fa-thumbs-up"></i> Like</a>
                                </div>
                                <div class="fb-btn-holder">
                                    <a href="#"><i class="far fa-comment-alt"></i> Comment</a>
                                </div>
                                <div class="fb-btn-holder">
                                    <a href="#"><i class="far fa-share-square"></i> Share</a>
                                </div>
                            </div>
                        </div>

                        <form action="/comment" method="POST">
                            <div class="fb-card-comments">
                                <div class="comment-input-holder">
                                    <div class="user-thumb">
                                        <img src="https://randomuser.me/api/portraits/women/85.jpg" class="img-responsive" />
                                    </div>
                                    <div class="comment-input">
                                        <input class="_postId" name="_postId" value="" hidden>
                                        <input class="_userId" name="_userId" value="" hidden>
                                        <input class="form-control" contenteditable="true" placeholder="write a comment"
                                            style="font-size: 0.8rem;" name="content_comment">
                                    </div>
                                </div>
                </div>
                </form>
                </div>
                </div>
                <div class="created-by" style="text-align:center;margin-bottom:16px;"></div>
            `

            $("div.container-post").prepend(post)
            location.reload();
        }
        
    })
    
}

function enterToPost() {
    $('div.fb-card-comments').each(function () {
        $(this).find('input.form-control').keypress(function (e) {
            if (e.which == 10 || e.which == 13) {
                this.form.submit();
            }
        });
        $(this).find('input[type=submit]').hide();
        
    });
};


//===========================================================================
//                                                                          *
//                            CATEGORIES                                    *
//                                                                          *
//===========================================================================

function addCategorie() {
    $.ajax({
        type: "POST",
        url: "/cate",
        data: {
            "name": $("#add_Category").val()
        },
        success: (data) => {
            let json = data.data
            console.log(data)
            $("tbody").append(

                `<tr>
                    <td>
                        <span class="custom-checkbox">
                            <input type="checkbox" id="checkbox1" name="options[]" value="1">
                            <label for="checkbox1"></label>
                        </span>
                    </td>
                    <td>New</td>
                    <td>${json._id}</td>
                    <td>${json.name}</td>
                    <td>
                        <a href="#editCategoryModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deleteCategoryModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`
            )
            $("#addCategoryModal").modal('toggle')
        }
    });
}
$(document).ready(function () {
    $("a.edit").click(function () {
        let get_id = $(this).closest("tr").find("td.id").text();
        let get_name = $(this).closest("tr").find("td.name").text();
        $("input.input-edit").val(get_name);
        $("div.input-id").text(get_id);
    });
})

function editCategorie() {
    let get_name = $("input.input-edit").val()
    let get_id = $("div.input-id").text()
    let url = "/cate/" + get_id
    $.ajax({
        type: "PUT",
        url: url,
        data: {
            "name": $("input.input-edit").val(),
            "id": $("div.input-id").text()
        },
        success: (data) => {
            let json = data.data
            $("td." + get_id).closest("tr").find("td.name").text(get_name)
            $("#editCategoryModal").modal('toggle')

        }
    });
}

//===========================================================================
//                                                                          *
//                            DEPARTMENT                                    *
//                                                                          *
//===========================================================================
function addDepartment() {
    $.ajax({
        type: "POST",
        url: "/department",
        data: {
            "name": $("#add_department").val()
        },
        success: (data) => {
            let json = data.data
            console.log(data)
            $("tbody").append(

                `<tr>
                    <td>
                        <span class="custom-checkbox">
                            <input type="checkbox" id="checkbox1" name="options[]" value="1">
                            <label for="checkbox1"></label>
                        </span>
                    </td>
                    <td>New</td>
                    <td>${json._id}</td>
                    <td>${json.name}</td>
                    <td>
                        <a href="#editDepartmentModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deleteDepartmentModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`
            )
            $("#addDepartmentModal").modal('toggle')
            location.reload();
        }
    });
}

// $( document ).ready(function() {
//     $("a.edit").click(function(){
//         let get_id = $(this).closest("tr").find("td.id").text();
//         let get_name = $(this).closest("tr").find("td.name").text();
//         $("input.input-edit").val(get_name);
//         $("div.input-id").text(get_id);
//     });
// })

function editDepartment() {
    let get_name = $("input.input-edit").val()
    let get_id = $("div.input-id").text()
    let url = "/department/" + get_id
    $.ajax({
        type: "PUT",
        url: url,
        data: {
            "name": $("input.input-edit").val(),
            "id": $("div.input-id").text()
        },
        success: (data) => {
            let json = data.data
            $("td." + get_id).closest("tr").find("td.name").text(get_name)
            $("#editDepartmentModal").modal('toggle')
            location.reload();
        }
    });
}

function deleteDepartment(__id) {
    let get_name = $("input.input-edit").val()
    let get_id = $("div.input-id").text()

    let url = "/department/" + __id
    $.ajax({
        type: "DELETE",
        url: url,
        data: {
            "name": get_name,
            "id": get_id
        },
        success: (data) => {
            let json = data.data

            $("form").append(
                `<div class="modal-header">						
                <h4 class="modal-title ${json.name}"><b> ${json.name}</b></h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>
                <div class="modal-body">					
                    <p>Are you sure you want to delete these Records?</p>
                    <p class="text-warning"><small>This action cannot be undone.</small></p>
                </div>
                <div class="modal-footer">
                    <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                    <input type="submit" class="btn btn-danger" value="Delete" onclick="deleteDepartment(${get_id})">
                </div>`
            )
            $("#deleteDepartmentModal").modal('toggle')
            location.reload();

        }
    });
}


//===========================================================================
//                                                                          *
//                            ANNOUNCE                                      *
//                                                                          *
//===========================================================================


//===========================================================================
//                                                                          *
//                               lOGIN                                      *
//                                                                          *
//===========================================================================

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function login() {
    $.ajax({
        url: '/account/login',
        type: 'POST',
        data:
        {
            email: $("#email").val(),
            password: $("#password").val()
        }
    }).then(data => {
        setCookie('token', data.token, 0)
        setCookie('email', data.email, 0)
        setCookie('token', data.token, 1)
        setCookie('email', data.email, 1)
        window.location.href = '/';
    }).catch(err => {
        console.log(err)
    })
}

//===========================================================================
//                                                                          *
//                            ACCOUNTS                                      *
//                                                                          *
//===========================================================================

// $("a.edit").click(function(){
//     let get_id = $(this).closest("tr").find("td.id").text();
//     let get_name = $(this).closest("tr").find("td.name").text();
//     let get_deparment = $(this).closest("tr").find("td.department").text();
//     let get_deparment_id = $(this).closest("tr").find("td.department_id").text();
//     let get_username = $(this).closest("tr").find("td.username").text();
//     let get_role = $(this).closest("tr").find("td.role").text();
//     let get_email = $(this).closest("tr").find("td.email").text();
//     let tr_id =$(this).closest("tr").parent().find("tr").attr("id");
//     // console.log(get_id,get_name,get_deparment,get_deparment_id,get_username,get_role,get_email)
//     console.log(tr_id)
//     $("#tr_id").text(tr_id)
//     $("#_id").text(get_id)
//     $("#edit-name").val(get_name)
//     $("#edit-username").val(get_username)
//     $("#edit-email").val(get_email)
//     $("#edit-name").val(get_name)
// });
function addAccount() {	
$.ajax({
    type: "POST",
    url: "/account/register",
    data: {
        "name":$("#Name").val(),
        "department_id":$("#department_id option").filter(':selected').val(),
        "username":$("#username").val(),
        "role":$("#role").val(),
        "email":$("#add-email").val(),
        "password":$("#add-password").val()
    },
    success: (data)=>{
        let json = data.data
        console.log(data)
        $("tbody").append(
            `<tr>
                <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" id="checkbox1" name="options[]" value="1">
                        <label for="checkbox1"></label>
                    </span>
                </td>
                <td>New</td>
                <td class="id ${json.role}">${json.role}</td>
                <td class="name ${json.name}">${json.name}</td>
                <td>${$("#department_id option").filter(':selected').text()}</td>
                <td>${json.email}</td>
                <td>
                    <a href="#editUserModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                    <a href="#deleteUserModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
            </tr>` 
        )
        $("#addUserModal").modal('toggle')
        location.reload();
    }
});
}
function editAccount() {
let get_tr_id = $("#tr_id").text()
let get_id = $("#_id").text()
let get_name = $("#edit-name").val()
let get_deparment = $("#edit-department_id option").filter(':selected').text()
let get_deparment_id = $("#edit-department_id option").filter(':selected').val()
let get_username = 	$("#edit-username").val()
let get_role = "Admin da sua";
let get_email = $("#edit-email").val()
let url = "/account/"+get_id
// console.log(url)
$.ajax({
    type: "PUT",
    url: url,
    data: {
        "name":get_name,
        "_departmentId":get_deparment_id,
        "username":get_username,
        "role":get_role,
        "email":get_email
    },
    success: (data)=>{
        let json = data.data
        console.log(data)
        $("#"+get_tr_id).remove()
        $("tbody").append(
            `<tr>
                <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" id="checkbox1" name="options[]" value="1">
                        <label for="checkbox1"></label>
                    </span>
                </td>
                <td>Update</td>
                <td>${get_role}</td>
                <td>${get_name}</td>
                <td>${get_deparment}</td>
                <td>${get_email}</td>
                <td>
                    <a href="#editUserModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                    <a href="#deleteUserModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
            </tr>` 
        )
        $("#editUserModal").modal('toggle')
        location.reload();
    }
});
}
function deleteUser(__id) {
let get_id = $("#_id").text()

let url = "/account/"+ __id
$.ajax({
    type: "DELETE",
    url: url,
    data:{
        "id" : get_id,
        "name":$("#Name").val(),
    },
    success: (data)=>{
        let json = data.data

        $("form").append(
            `<div class="modal-header">		
                            
                            <h4 class="modal-title ${json.name}"><b> ${json.name} </b></h4>
                            
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div class="modal-body">					
                            <p>Are you sure you want to delete these Records?</p>
                            <p class="text-warning"><small>This action cannot be undone.</small></p>
                        </div>
                        <div class="modal-footer">
                            <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                            
                                <input type="submit" class="btn btn-danger" value="Delete" onclick="deleteUser(${json._id})">
                        </div>` 
        )
        $("#deleteUserModal").modal('toggle')
        location.reload();
            
    }
});
}

// Call funtion
$(document).ready(function () {
    enterToPost();
});