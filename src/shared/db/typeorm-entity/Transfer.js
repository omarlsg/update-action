module.exports = {
    name: 'Transfer',
    columns: {
      transferId: {
        primary: true,
        type: 'varchar',
        length: 20
        // generated: 'uuid'
      },
      txId: {
        type: 'varchar',
        length: 20,
        nullable: true
      },
      txRef: {
        type: 'varchar',
        length: 20,
        nullable: true
      },
      source: {
        type: 'varchar',
        length: 64,
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
      sourceSignerBalance: {
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
        length: 64,
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
      targetSignerBalance: {
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
        scale: 2,
        nullable: true
      },
      symbol: {
        type: 'varchar',
        length: 16,
        nullable: true
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
        type: 'json',
        nullable: true
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
        length: 64,
        nullable: true
      },
      owner: {
        type: 'varchar',
        length: 32,
        nullable: true
      }
    }
  }
  