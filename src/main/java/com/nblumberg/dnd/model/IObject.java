/*
 * @(#)IObject
 *
 * Copyright 2011 by Constant Contact Inc.,
 * Waltham, MA 02451, USA
 * Phone: (781) 472-8100
 * Fax: (781) 472-8101
 *
 * All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Constant Contact, Inc. created for Constant Contact, Inc.
 * You shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement
 * you entered into with Constant Contact, Inc.
 * 
 * History
 *
 * Date         Author      Comments
 * ====         ======      ========
 *
 * 
 **/
package com.nblumberg.dnd.model;

public interface IObject extends IModifiable {
    public String getName();
    public void setName(String value);
    
    public Integer getHP();
    public void setHP(Integer value);
    
    public Integer getAC();
    public void setAC(Integer value);
    
    public Integer getFORT();
    public void setFORT(Integer value);
    
    public Integer getREF();
    public void setREF(Integer value);
    
    public Integer getWILL();
    public void setWILL(Integer value);
    
    public Double getWeight();
    public void setWeight(Double value);
    

}
