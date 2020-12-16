module.exports = {
  name: 'Action',
  columns: {
    action_id: {
      primary: true,
      unique: true,
      type: 'varchar',
      length: 36
    },
    transferId: {
      type: 'varchar',
      length: 20,
      nullable: true
    },
    source: {
      type: 'varchar',
      length: 64
    },
    sourceBalance: {
      type: 'decimal',
      precision: 20,
      scale: 2,
      nullable: true
    },
    sourceWallet: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    sourceSigner: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    sourceBank: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    sourceBankBicfi: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    target: {
      type: 'varchar',
      length: 64
    },
    targetBalance: {
      type: 'decimal',
      precision: 20,
      scale: 2,
      nullable: true
    },
    targetWallet: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    targetSigner: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    targetBank: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    targetBankBicfi: {
      type: 'varchar',
      length: 64,
      nullable: true
    },
    amount: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    symbol: {
      type: 'varchar',
      length: 16
    },
    type: {
      type: 'varchar',
      length: 16,
      nullable: true
    },
    status: {
      type: 'varchar',
      length: 16,
      nullable: true
    },
    description: {
      type: 'text',
      nullable: true
    },
    created: {
      type: 'varchar',
      length: 32,
      nullable: true
    },
    updated: {
      type: 'varchar',
      length: 32,
      nullable: true
    },
    labels: {
      type: 'json'
    },
    snapshot: {
      type: 'json',
      nullable: true
    },
    error: {
      type: 'json',
      nullable: true
    },
    domain: {
      type: 'varchar',
      length: 64
    },
    owner: {
      type: 'varchar',
      length: 64,
      nullable: true
    }
  }
}