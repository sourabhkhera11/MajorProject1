import { Repository } from "typeorm";
import { AppDataSource } from "../Data-source";
import { Customer } from "../entity/CustomersEntity";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/Constant";
import { getSafeSelectFields } from "../utils/SelectFields";

export class customersRepository {
  private customerRepo: Repository<Customer>;

  constructor() {
    this.customerRepo = AppDataSource.getRepository(Customer);
  }

  async insertCustomer(customerData: Customer): Promise<Customer> {
    const customer = await this.customerRepo.save({
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
    });
    return customer;
  }

  async fetchAllCustomers(
    take: number = 10,
    skip: number = 0,
    fields?: string[],
  ): Promise<Customer[]> {
    const safeFields = getSafeSelectFields(AppDataSource, Customer, fields);
    const customers = await this.customerRepo.find({
      take,
      skip,
      select: safeFields,
    });
    return customers;
  }

  async fetchCustomer(
    inputId: bigint,
    fields?: string[],
  ): Promise<Customer | null> {
    const safeFields = getSafeSelectFields(AppDataSource, Customer, fields);
    const customer = await this.customerRepo.findOne({
      where: {
        id: inputId,
      },
      select: safeFields,
    });
    return customer;
  }

  async deleteCustomer(inputId: bigint): Promise<void> {
    const result = await this.customerRepo.delete({ id: inputId });
    if (result.affected === 0) {
      throw new AppError("Customer not Found", HTTP_STATUS.NOT_FOUND);
    }
  }

  async updateCustomerById(
    inputId: bigint,
    updateData: Partial<Customer>,
  ): Promise<void> {
    const result = await this.customerRepo.update({ id: inputId }, updateData);
    if (result.affected === 0) {
      throw new AppError("Customer not found", HTTP_STATUS.NOT_FOUND);
    }
  }

  async isDuplicate(inputEmail: string): Promise<boolean> {
    const customer = await this.customerRepo.findOneBy({
      email: inputEmail,
    });
    return customer ? true : false;
  }

  async allOrdersOfCustomer(inputId: bigint): Promise<Customer | null> {
    const result = await this.customerRepo.findOne({
      where: {
        id: inputId,
      },
      relations: {
        orders: {
          productId: true,
        },
      },
      select: {
        id: true,
        name: true,
        orders: {
          id: true,
          status: true,
          totalAmount: true,
          productId: {
            id: true,
            title: true,
          },
        },
      },
    });
    return result;
  }
}
