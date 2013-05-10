/*
 * @(#)ICreature
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

public interface ICreature extends IObject {
    public Size getSize();
    public void setSize(Size value);
    
    public Boolean getNatural();
    public void setNatural(Boolean value);
    
    public Integer getSTR();
    public void setSTR(Integer value);
    
    public Integer getDEX();
    public void setDEX(Integer value);
    
    public Integer getCON();
    public void getCON(Integer value);
    
    public Integer getINT();
    public void getINT(Integer value);
    
    public Integer getWIS();
    public void getWIS(Integer value);
    
    public Integer getCHA();
    public void setCHA(Integer value);
    
    public Integer getINIT();
    public void setINIT(Integer value);

    public Integer getSkill(String skill);
    public void setSkill(String skill, Integer value);

    public Integer getAcrobatics();
    public void setAcrobatics(Integer value);

    public Integer getArcana();
    public void setArcana(Integer value);

    public Integer getAthletics();
    public void setAthletics(Integer value);

    public Integer getBluff();
    public void setBluff(Integer value);

    public Integer getDiplomacy();
    public void setDiplomacy(Integer value);

    public Integer getDungeoneering();
    public void setDungeoneering(Integer value);

    public Integer getEndurance();
    public void setEndurance(Integer value);

    public Integer getHeal();
    public void setHeal(Integer value);

    public Integer getHistory();
    public void setHistory(Integer value);

    public Integer getInsight();
    public void setInsight(Integer value);

    public Integer getIntimidate();
    public void setIntimidate(Integer value);

    public Integer getNature();
    public void setNature(Integer value);

    public Integer getPerception();
    public void setPerception(Integer value);

    public Integer getReligion();
    public void setReligion(Integer value);

    public Integer getStealth();
    public void setStealth(Integer value);

    public Integer getStreetwise();
    public void setStreetwise(Integer value);

    public Integer getThievery();
    public void setThievery(Integer value);
}
