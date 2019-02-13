import { observable,action, observe } from 'mobx'

class RootStore {
    constructor() {
        this.stateStore = new stateStore();
    }
}

class stateStore{

    //被观察的字段
    @observable
    name = 'Zoey';

    //wss
    @observable
    ENDPOINT = 'wss://poc3-rpc.polkadot.io/';
    // ENDPOINT = 'ws://107.173.250.124:9944/';

    // 是否是第一次登陆
    @observable
    isfirst=0
    // 所有账户
    @observable
    Accounts=[
        {account:'NeedCreate',address:'xxxxxxxxxxxxxxxxxxxxxxxxxxx'}
    ]
    // 通讯录
    @observable
    Addresses=[
        // {Name:'',Memo:'',Address:''}
    ];

    // 正在登陆的账户
    @observable
    Account = 0;
    // 账户数量(除默认账户以外)
    @observable
    Accountnum = 0;

    // 交易信息
    @observable
    transactions={};
    // 当前交易信息是否是最后一页
    @observable
    hasNextPage;
    //balance
    @observable
    balance=0;
    // 转账地址
    @observable
    inaddress='';
    //转账金额
    @observable
    value=0;
    // 第几笔交易
    @observable
    accountNonce=0;
    //折线图数据
    @observable
    option={
        title: {
          show:false
        },
        tooltip: {},
        legend: {
            data: ['']
        },
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [{
            type: 'line',
            data: []
        }]
    };
    //转到通讯录
    @observable
    transfer_address=0;
    //选中地址
    @observable
    t_address='';
    //是否是从通讯录中选出的地址
    @observable
    isaddresses=0;

    //判断是从哪里扫过来的
    @observable
    tocamera=0;//0代表从Assets界面，1代表transfer，2代表通讯录
    //是否是扫码得到的地址
    @observable
    iscamera=0;
    //二维码扫描到的地址
    @observable
    QRaddress='';







    //Staking
    //validators
    // @observable
    // validators='';








    //被观察的操作
    @action
    setName(newName){
        this.name=newName;
    }
    
}


export default new RootStore();

