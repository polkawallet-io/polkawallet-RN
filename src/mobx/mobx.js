import { observable,action } from 'mobx'

class RootStore {
    constructor() {
        this.stateStore = new stateStore();
    }
}

class stateStore{

    //被观察的字段
    @observable
    name = 'Zoey';

    // 所有账户
    @observable
    Accounts=[
        {account:'AliceAccount',address:'5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ'}
    ]

    // 正在登陆的账户
    @observable
    Account = 0;

    // 交易信息
    @observable
    transactions={};

    //被观察的操作
    @action
    setName(newName){
        this.name=newName;
    }
    
}


export default new RootStore();

