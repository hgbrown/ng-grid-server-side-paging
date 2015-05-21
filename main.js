var app = angular.module('myApp', ['ngGrid']);
app.controller('MyCtrl', function ($scope, $http) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 15],
        pageSize: 5,
        currentPage: 1,
        totalServerItems: $scope.totalServerItems
    };
    $scope.setPagingData = function (data, page, pageSize) {
        console.log('data.length=[' + data.length + ']');
        console.log('page=[' + page + ']');
        console.log('pageSize=[' + pageSize + ']');

        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        $scope.pagingOptions.totalServerItems = data.length;

        console.log('totalServerItems=[' +$scope.totalServerItems+ ']');
        console.log('pagedData.length=[' +pagedData.length+ ']');
        console.log('$scope.pagingOptions=[' +JSON.stringify($scope.pagingOptions)+ ']');

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                    data = largeLoad.filter(function (item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            } else {
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad, page, pageSize);
                });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        console.log('pagingOptions.watch: newVal=[' + JSON.stringify(newVal) + '] oldVal=[' + JSON.stringify(oldVal) + ']');
        console.log('$scope.pagingOptions.pageSize=[' +$scope.pagingOptions.pageSize+ ']');
        console.log('$scope.pagingOptions.currentPage=[' +$scope.pagingOptions.currentPage+ ']');

        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});
