///
$(document).ready(function () {
    
    console.log('ok');
    $('.btn-add').on('click', function () {
        // Find the closest '.horizontal-item' ancestor
        var item = $(this).closest('.horizontal-item');
        // Extract properties
        var productName = item.find('.product-name b').text();
        var ram = item.find('.product-properties p').eq(0).text().replace('Ram: ', '');
        var storage = item.find('.product-properties p').eq(1).text().replace('Storage: ', '');
        var importPrice = item.find('.pricing p').text();

        // Log or use the properties
        console.log("Product Name: " + productName);
        console.log("RAM: " + ram);
        console.log("Storage: " + storage);
        console.log("Import Price: " + importPrice);
        
        
        // Optionally, perform further actions with these values
    });
    
});