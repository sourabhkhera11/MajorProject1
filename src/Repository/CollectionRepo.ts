import { Repository } from "typeorm";
import { Collection } from "../entity/CollectionEntity";
import { AppDataSource } from "../Data-source";
import { AppError } from "../utils/AppError";
import { getSafeSelectFields } from "../utils/SelectFields";
import { HTTP_STATUS } from "../utils/Constant";
import { Product } from "../entity/ProductEntity";

export class collectionRepository {
  private collectionRepo: Repository<Collection>;

  constructor() {
    this.collectionRepo = AppDataSource.getRepository(Collection);
  }

  async createCollections(collectionData: Collection): Promise<Collection> {
    const collection = this.collectionRepo.save({
      title: collectionData.title,
    });
    return collection;
  }

  async fetchCollections(
    take: number = 10,
    skip: number = 0,
    fields?: string[],
  ): Promise<Collection[]> {
    const safeFields = getSafeSelectFields(AppDataSource, Collection, fields);
    const collection = await this.collectionRepo.find({
      take,
      skip,
      select: safeFields,
    });
    return collection;
  }

  async fetchCollection(
    id: bigint,
    fields?: string[],
    fetchProduct: boolean = false,
  ): Promise<Collection | null> {
    const safeFields = getSafeSelectFields(AppDataSource, Collection, fields);
    const collection = await this.collectionRepo.findOne({
      where: {
        id,
      },
      select: safeFields,
      relations: {
        products: fetchProduct,
      },
    });
    return collection;
  }

  async deleteCollection(id: bigint): Promise<void> {
    const result = await this.collectionRepo.delete({
      id,
    });
    if (result.affected === 0) {
      throw new AppError("Collection Not Found", HTTP_STATUS.NOT_FOUND);
    }
  }

  async updateCollection(
    inputId: bigint,
    updateData: Partial<Collection>,
  ): Promise<void> {
    const result = await this.collectionRepo.update(
      { id: inputId },
      updateData,
    );
    if (result.affected === 0) {
      throw new AppError("Collection Not Found", HTTP_STATUS.NOT_FOUND);
    }
  }

  async addProductToCollection(collection: Collection, product: Product[]) {
    collection.products.push(...product);
    await this.collectionRepo.save(collection);

    return collection;
  }

  async fetchCollectionWithProduct(): Promise<Collection[]> {
    const result = await this.collectionRepo.find({
      relations: {
        products: true,
      },
    });
    return result;
  }
}
