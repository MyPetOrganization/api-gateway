import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { NATS_SERVICE } from "src/config";
import { CreateProductDto } from "./dto/create-products.dto";
import { catchError, firstValueFrom } from 'rxjs';
import { LogginService } from "src/logging/logtail.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UpdateProductDto } from "./dto/update-products.dto";

/**
 * Controller for the products routes.
 */
@Controller('products')
export class ProductsController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
        private readonly logtailService: LogginService
    ) { }

    /**
   * Create a new product.
   * @param req - The HTTP request.
   * @param createProductDto - The data to create the product.
   * @param image - The image of the product.
   * @returns A promise that resolves with the response of the creation.
   */
    @UseGuards(AuthGuard)
    @Post(':id')
    @UseInterceptors(FileInterceptor('image'))
    async createProduct(
        @Req() req: Request,
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() image: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
    ) {
        // Get the user from the microservice
        const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));

        const url = "http://" + req.headers['host'] + req.url;
        // Create the product
        const product = await firstValueFrom(this.client.send({ cmd: 'create_product' }, { createProductDto, image }))
            .catch(() => {
                this.logtailService.error(`Product ${createProductDto.name} isn't registered - ${url}`);
                throw new RpcException('Error creating product');
            });

        // Log the creation of the product
        this.logtailService.log(`Creating a new product ${createProductDto.name}, ${createProductDto.price} and ${createProductDto.userId}  - ${url}`);
        return product;
    }

    /**
   * Get all products.
   * @returns A promise that resolves with the response of the retrieval.
   */
    @Get()
    findAllProducts() {
        return this.client.send({ cmd: 'get_all_products' }, {})
    }

    /**
   * Get all products of a user.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @returns A promise that resolves with the response of the retrieval.
   */
    @UseGuards(AuthGuard)
    @Get(':id')
    async findAllOfSeller(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
        const url = "http://" + req.headers['host'] + req.url;
        this.logtailService.log(`Getting all products for user ${user.name}, ${user.email} - ${url}`);
        return this.client.send({ cmd: 'get_all_seller_products' }, { id })
            .pipe(catchError(() => {
                this.logtailService.error(`User ${user.name}, ${user.email} cannot get the products - ${url}`);
                throw new RpcException('Error getting products');
            }));
    }

    /**
   * Get one product by its name.
   * @param req - The HTTP request.
   * @param id - The id of the user.
   * @param name - The produt name.
   * @returns A promise that resolves with the response of the retrieval.
   */
    @UseGuards(AuthGuard)
    @Post('fobn/:id')
    async findOneByName(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body('name') name: string,
    ) {
        const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id }));
        const url = "http://" + req.headers['host'] + req.url;
        const product = await firstValueFrom(this.client.send({ cmd: 'get_by_name' }, { id, name }))
            .catch(() => {
                this.logtailService.error(`Product ${name} for user ${user.name}, ${user.email} not found - ${url}`);
                throw new RpcException('Product not found');
            });
        this.logtailService.log(`Getting ${name} product for user ${user.name}, ${user.email} - ${url}`);
        return product;
    }

    /**
   * Update a product.
   * @param req - The HTTP request.
   * @param id - The id of the product.
   * @param updateUserDto - The data to update the product.
   * @param image - The image of the product.
   * @returns A promise that resolves with the response of the update.
   */
    @UseGuards(AuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    updateProduct(
        @Req() req: Request,
        @Param('id') id: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        const url = "http://" + req.headers['host'] + req.url;
        const product = firstValueFrom(this.client.send({ cmd: 'update_product' }, { id, updateProductDto, image }))
            .catch(() => {
                this.logtailService.error(`Cannot update product with name ${updateProductDto.name} - ${url}`);
                throw new RpcException('Product not found');
            });
        this.logtailService.log(`Updated product with name ${updateProductDto.name} - ${url}`);
        return product;
    }

    /**
   * Delete a product.
   * @param req - The HTTP request.
   * @param userId - The user id.
   * @param id - The id of the product.
   * @returns A promise that resolves with the response of the deletion.
   */
    @UseGuards(AuthGuard)
    @Delete(':userId')
    async removeProduct(
        @Req() req: Request,
        @Param('userId', ParseIntPipe) userId: number,
        @Body('id', ParseIntPipe) id: number,
    ) {
        console.log(userId, id);
        const user = await firstValueFrom(this.client.send({ cmd: 'get_one_user' }, { id: userId }));
        const url = "http://" + req.headers['host'] + req.url;
        this.logtailService.log(`Deleting ${id} product for user ${user.name}, ${user.email} - ${url}`);
        return this.client.send({ cmd: 'delete_product' }, { id })
            .pipe(catchError(() => {
                this.logtailService.error(`User ${user.name}, ${user.email} cannot delete the product ${id} - ${url}`);
                throw new RpcException('Error deleting product');
            }));
    }
}