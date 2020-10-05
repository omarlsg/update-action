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
    }
  }
}
