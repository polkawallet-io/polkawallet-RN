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

    //账户的Staking状态 0:Off click , 1:false , 2:Stake , 3:Nominate ,
    @observable
    StakingState = 0;
    //账户是否在validators里面,
    @observable
    isvalidators = 0;

    
    //wss
    @observable
    ENDPOINT = 'wss://poc3-rpc.polkadot.io/';
    // ENDPOINT = 'ws://107 .173.250.124:9944/';
    // ENDPOINT = 'ws://127.0.0.1:9944/';

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
    // 刷新前登陆的账户
    @observable
    refreshBefore = 0;

    // 交易信息
    @observable
    transactions={};
    // 当前交易信息是否是最后一页
    @observable
    hasNextPage;

    // 本地账户的Staking Records
    @observable
    StakingRecords={};
    // 是否是本地账户的Staking Records的最后一页
    @observable
    StakingNextPage;

    //当前账户在balances中的为止
    @observable
    balanceIndex=0
    //所有账户balance
    @observable
    balances=[{address:'xxxxxxxxxxxxxxxxxxxxxxxxxxx',balance:0}]

    //所有账户中有没有这个用户地址
    @observable
    have=0
        
    //balance
    @observable
    balance='0';
    // 转账地址
    @observable
    inaddress='';
    //转账金额
    @observable
    value=0;
    // 第几笔交易
    @observable
    accountNonce=0;
    //conin_details折线图数据
    @observable
    option={
        title: {
            text: 'Assets change record, Unit(xxx)',
            textStyle:{
                color:'grey',
                fontSize:16,
        
            },
           
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
    //staking折线图数据
    @observable
    StakingOption={
        title: {
            text: 'Staking slash record, Unit(xxx)',
            textStyle:{
                color:'grey',
                fontSize:16,
            },
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
    //Staking界面本地账户的nominating
    @observable
    nominating=[]
    //Staking界面本地账户的nominating的余额
    @observable
    nominatingBalance=0
    //Staking界面本地账户的mynominators
    @observable
    mynominators=[]
    //Staking界面本地账户的mynominators的余额
    @observable
    mynominatorsBalance=[]
    //Staking界面本地账户的mynominators的余额额度总和sumnominatingBalance
    @observable
    sumnominatingBalance=[]

    //******************* */Democracy界面*******************
    //referendumCount
    @observable
    referendumCount='0';

    

    //referendums
    @observable
    votingState=[]

    //Actives_Nofixed不确定的数据
    @observable
    Actives_Nofixed=[];


    






    //转到通讯录
    @observable
    transfer_address=0;
    //选中地址
    @observable
    t_address='';
    //是否是从通讯录中选出的地址
    @observable
    isaddresses=0;

    //判断是从哪里进入的nominate
    @observable
    tonominate=0;//0代表从Account Actions界面，1代表Staking Overview

    //判断是从哪里扫过来的
    @observable
    tocamera=0;//0代表从Assets界面，1代表transfer，2代表通讯录
    
    //是否是扫码得到的地址
    @observable
    iscamera=0;
    //二维码扫描到的地址
    @observable
    QRaddress='';





    //*****************************   设置   *********************************** 
    //手势密码
    @observable
    Gesture='';
    //手势密码的模式：0 代表无密码，1 代表确认密码，2 代表验证密码
    @observable
    GestureState=0;
    







    //被观察的操作
    @action
    setName(newName){
        this.name=newName;
    }
    
}


export default new RootStore();

