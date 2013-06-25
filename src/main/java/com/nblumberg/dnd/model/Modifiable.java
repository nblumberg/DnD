/*
 * @(#)Modifiable
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

import java.util.Map;
import java.util.HashMap;

public class Modifiable implements IModifiable {
    
    private Map<String, IProperty> properties = new HashMap<String, IProperty>();

    @Override
    public void addProperty(String property) {
        addProperty(property, null);
    }

    @Override
    public void addProperty(String property, Integer value) {
        addProperty(new Property(property, value));
    }

    @Override
    public void addProperty(IProperty property) {
        if (!properties.containsKey(property.getName())) {
            properties.put(property.getName(), property);
        }
    }

    @Override
    public <T> IProperty<T> getProperty(String property, T type) {
        if (hasProperty(property)) {
            Class x = type instanceof Object ? type.getClass() : null;
            IProperty<T> prop =  properties.get(property);
            if (prop.getType()) {
                
            }
            return (IProperty<T>)properties.get(property);
        }
        return null;
    }

    @Override
    public <T> T getPropertyValue(String property, T type) {
        IProperty<T> prop = getProperty(property);
        if (prop != null && prop instanceof IProperty<T>) {
            return prop.getValue();
        }
        return null;
    }

    @Override
    public boolean hasProperty(String property) {
        return properties.containsKey(property);
    }
    
    @Override
    public <T> void setProperty(String property, T value) {
        // TODO Auto-generated method stub

    }

    @Override
    public void removeProperty(String property) {
        // TODO Auto-generated method stub

    }

}
