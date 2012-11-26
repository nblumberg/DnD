/*
 * @(#)Modifier
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

public class Modifier<T> extends Property<T> implements IModifier<T> {
    public Modifier() {
        super();
    }
    
    public Modifier(String name) {
        super(name);
    }
    
    public Modifier(String name, T value) {
        super(name, value);
    }
    
    public T modifyValue(T value) {
        return value;
    }
}
