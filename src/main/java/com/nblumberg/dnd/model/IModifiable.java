/*
 * @(#)IModifiable
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

public interface IModifiable {
    public void addProperty(String property);
    public void addProperty(String property, Integer value);
    public void addProperty(IProperty property);
    public <T> IProperty<T> getProperty(String property, T type);
    public <T> T getPropertyValue(String property, T type);
    public boolean hasProperty(String property);
    public <T> void setProperty(String property, T value);
    public void removeProperty(String property);
}
