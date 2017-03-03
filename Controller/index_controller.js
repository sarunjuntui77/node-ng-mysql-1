var scotchTodo = angular.module('app', ['ngAnimate']);
scotchTodo.controller('productsTable', function($scope,$timeout,$http) {
    $scope.wait = true;
    $http.get('/get_session')
        .success((data)=> {
            if(data == 'no_session'){
                $scope.login_form = true;
            }else{
                $scope.login_form = false;
                $scope.user_session = true;   
            }
    });  

    $http.get('/get_all_products')
        .success((data)=> {
        $scope.products = data;
        $scope.wait = false;
        $scope.main = true;  
    });

    $http.get('/get_all_suppliers')
        .success((data)=> {
        $scope.suppliers= data;
    });

    $scope.login_submit = (event)=> {
        $http.post('/login',$scope.login)
        .success((data)=> {
            if(data.length == 0){
                alert('Login Falied ');
            }else{
                data = data[0];
                alert('Welcome '+ data.member_name);
                $scope.user_session = true;   
                $scope.login = {};
            }
        });
    }

    $scope.logout = (event)=> {
        $http.post('/logout',$scope.login)
        .success((data)=> {
            $scope.user_session = false;        
        });
    }
    $scope.createSession = (event)=> {
        $http.get('/create_session')
        .success((data)=> {
            if(data == "Sarun"){
                $scope.user_session=true;
            }
        });
    }
    $scope.form_submit = (event)=> { 
        if($scope.add_button == true){
            $http.post('/add_product', $scope.form_products)
            .success((data)=> {
                    $http.get('/get_all_products')
                        .success((data)=> {
                        $scope.products = data;
                    });
            });
        }else{
            $http.post('/edit_product', $scope.form_products)
            .success((data)=> {
                    $http.get('/get_all_products')
                        .success((data)=> {
                        $scope.products = data;
                    });
            });
        }
    }

    $scope.delete_product = (event)=> { 
        $http.get('/delete/'+event.target.id)
        .success((data)=> {
            $http.get('/get_all_products')
            .success((data)=> {
                 $scope.products = data;
            });  
        });
      
    }

    $scope.edit_product = (event)=> {  
       $http.get('/get_products_by_id/'+event.target.id)
        .success((data)=> {
        $scope.form_products = data[0];
        let supplier_index  = parseInt($scope.form_products.supplier_id) -1 ;     
            $scope.form_products.supplier_id = $scope.suppliers[supplier_index];
            $scope.add_button =false;
            $scope.formModal = true;
        });

        
    }

    $scope.search = (event)=> {  
        if($scope.searchText != ''){
            $http.get('/search/'+$scope.searchText)
            .success((data)=> {          
                $scope.products = data;
            });
        }else{
            $http.get('/get_all_products')
            .success((data)=> {
            $scope.products = data;
            });
        }
    }

    $scope.showModal = ()=> {
        $scope.add_button =true;
        $scope.form_products = null;
        $scope.formModal = true;
        $scope.form_products = {
            supplier_id : 0
        };
        $scope.form_products.supplier_id = $scope.suppliers[0];
    }
   

   
  
});
