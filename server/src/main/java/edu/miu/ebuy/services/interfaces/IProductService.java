package edu.miu.ebuy.services.interfaces;
import edu.miu.ebuy.exceptions.ApplicationException;
import edu.miu.ebuy.models.Product ;
import edu.miu.ebuy.models.dto.ProductDto;
import edu.miu.ebuy.models.dto.ProductSearchItem;

import java.util.List;

public interface IProductService {



    public List<Product> getAll();
    public List<Product> getActive();
    public Product get(int productId);
    public Product create(Product product);
    public Product update(Product product);
    public void  delete(int productId);


    public void approveProduct(int productId, int statusId);
    public Product getServiceProduct();
    public List<Product> getProductByPrice(double fromPrice, double toPrice);

    public List<ProductDto> search(ProductSearchItem searchItem);
}
