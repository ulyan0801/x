  /**
   */
  export interface Patient {
  
    /**
       * 病人编号
       */
    patientId?: number
  
    /**
       * 头像相对路径
       */
    headImg?: string
  
    /**
       * 病人姓名
       */
    patientName?: string
  
    /**
       * 病人性别
       */
    patientSex?: number
  
    /**
       * 病人年龄
       */
    patientAge?: number
  
    /**
       * 病人身份证号
       */
    patientNumber?: number
  
    /**
       * 病人手机号
       */
    patientTel?: string
  
    /**
       * 病人密码
       */
    patientPassword?: string
  
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
  