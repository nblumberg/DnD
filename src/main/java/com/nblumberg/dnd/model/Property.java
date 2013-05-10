/*
 * @(#)Property
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

import java.util.List;
import java.util.ArrayList;

public class Property<T> implements IProperty<T> {
    public Property() {
    }
    
    public Property(String name) {
        this.name = name;
    }

    public Property(String name, T value) {
        this.name = name;
        this.value = value;
    }
    
    private List<IModifier<T>> modifiers = new ArrayList<IModifier<T>>();

    private String name = null;
    
    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String value) {
        name = value;
    }

    private DataType type = DataType.UNKNOWN;
    
    @Override
    public DataType getType() {
        return type;
    }

    @Override
    public void setType(DataType value) {
        type = value;
    }

    private T value = null;
    
    @Override
    public T getValue() {
        T temp = value;
        for (IModifier<T> m : modifiers) {
            temp = m.modifyValue(temp);
        }
        return temp;
    }

    @Override
    public void setValue(T value) {
        this.value = value;
    }

    @Override
    public void addModifier(IModifier<T> modifier) {
        if (!modifiers.contains(modifier)) {
            modifiers.add(modifier);
        }
    }
    
    @Override
    public IModifier<T> getModifier(String name) {
        for (IModifier<T> m : modifiers) {
            if (m.getName().equals(name)) {
                return m;
            }
        }
        return null;
    }
    
    @Override
    public void removeModifier(String name) {
        IModifier<T> m = getModifier(name);
        if (m != null) {
            modifiers.remove(m);
        }
    }

}
