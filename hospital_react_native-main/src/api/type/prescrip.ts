  /**
   */
  export interface Doctor {
  
    /**
       * 医生编号
       */
    doctorId?: number
  
    /**
       * 头像相对路径
       */
    headImg?: string
  
    /**
       * 科室编号
       */
    departmentId?: number
  
    /**
       * 医生姓名
       */
    doctorName?: string
  
    /**
       * 医生性别
       */
    doctorSex?: number
  
    /**
       * 医生年龄
       */
    doctorAge?: number
  
    /**
       * 医生电话
       */
    doctorTel?: string
  
    /**
       * 医生密码
       */
    doctorPassword?: string
  
    /**
       * 权限
       */
    userIdentity?: number
  
    /**
       * 创建时间
       */
    createTime?: Date
  
    /**
       * 更新时间
       */
    updateTime?: Date
  }
  
  /**
   */
  export interface Drugs {
  
    /**
       * 药品编号
       */
    drugsId?: number
  
    /**
       * 药品类型
       */
    drugsType?: string
  
    /**
       * 药品名称
       */
    drugsName?: string
  
    /**
       * 生产地点
       */
    productionLocation?: string
  
    /**
       * 生产日期
       */
    productionDate?: Date
  
    /**
       * 有效期
       */
    termValidity?: Date
  
    /**
       * 治疗功效
       */
    therapeuticEfficacy?: string
  
    /**
       * 库存数量
       */
    inventoryNum?: number
  
    /**
       * 入库单价
       */
    receiptPrice?: number
  
    /**
       * 出库单价
       */
    deliveryPrice?: number
  
    /**
       * 药品库存位置
       */
    duresPosition?: string
  }
  
  /**
   */
  export interface PrescriptionDrug {
  
    /**
       * 处方药品id
       */
    medicineId?: number
  
    /**
       * 挂号单id
       */
    registerId?: number
  
    /**
       * 药物id
       */
    drugsId?: number
  
    /**
       * 药物数量
       */
    medicineNum?: number
  
    /**
       * 药物备注
       */
    medicineNotes?: string
  
    drug?: Drugs
  }
  
  /**
   */
  export interface Prescription {
  
    /**
       * 处方编号
       */
    prescriptionId?: number
  
    /**
       * 挂号单id
       */
    registerId?: number
  
    /**
       * 医生编号
       */
    doctorId?: number
  
    /**
       * 病人编号
       */
    patientId?: number
  
    /**
       * 诊断结果
       */
    prescriptionDiagnosis?: string
  
    /**
       * 缴费状态
       */
    paymentStatus?: number
  
    /**
       * 处方时间
       */
    prescriptionTime?: Date
  
    doctor?: Doctor
  
    drugsList?: PrescriptionDrug[]
  }
  