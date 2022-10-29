import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import User from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

export class UserSeeder implements Seeder {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async seed(): Promise<any> {
        // const users = DataFactory.createForClass(User).generate(10);

        // console.log(users);
        const users = new User({
            username: 'admin',
            password: '123456',
            name: 'trung',
            address: 'tran cao van',
            phone: '0962043095',
        });
        console.log(users);
        return this.userRepository.save(users);
    }

    drop(): Promise<any> {
        return this.userRepository.clear();
    }
}
