var command = {
        // CORE
        // members and accessors
        agentId : long,
        allowScheduling : boolean, // real value: allowScheduling & !isInListReview();
        copyFromSourceEmail : boolean,
        emailStatusDisplayText : String,
        emptyRecipientLists : boolean,
        loadEmail : boolean,
        missingImages : boolean,
        missingPhysicalAddress : boolean,
        missingVerifiedEmailAddress : boolean,
        preRenderComplete : boolean,
        request : HttpServletRequest,
        response : HttpServletResponse,
        settings : { // EmailSettings
            emailName : String,
            footer : MessageFooterObject, // effectively caches getEco().getMessageFooter(), read-only
            header : MessageHeaderObject, // effectively caches getEco().getMessageHeader(), read-only
            recipientsMsg : String, // not sure what this is for
        },
        sourceEmailAgentUid : long,
        status : String,
        supportLink : String,
        templateImg : String, // TODO: should be moved to em/?
        templateName : String, // TODO: should be moved to em/?
        templateUID : long, // TODO: should be moved to em/?
        themeName : String, // TODO: should be moved to es/?
        
        // methods
        /*
         * see separate description (var eco) below 
         * 
         * Created by: ecampaignService.createEmailCampaign(this.getSiteOwner(), command.getTemplateName(), "");
         * Loaded by: EmailCampaignManager.generateCampaign(this.agentId, this.getSiteOwner().getUID());
         * Accessed by: ((UIStateObject)this.request.getSession().getAttribute("rovingObjects")).getEmailCampaignObject(this.agentId);
         */
        getEco(),
        getDco(),
        setEco(EmailCampaignObject), // puts settings.getHeader() in getEco().setMessageHeader() and copies values from getEco().getMessageFooter() into agent.setPermProp()
        
        getInListReview(), // this.isInListReview();
        isInListReview(), // this.getSiteOwner().isOverLimits(false);
        
        getSiteOwner(), // getSiteOwnerFacade().getSiteOwner();
        getSiteOwnerFacade(), // (SiteOwnerFacade)request.getAttribute(IConstantsCommon.SO_FACADE_ATTR_NAME);

        isEmailRoleConfirmed(), // EmailCampaignManager.getRoleCode(getEco()) == ITemplateCodes.CONFIRMED;

        
        // EM
        // members and accessors
        agentApprovalLevel : int,
        autoTweetEnabled : boolean,
        campaignType : String,
        currentState : String,
        emailStatsSelected : boolean,
        emailStatus : String,
        emailType : int,
        page : String,
        recipients : EmailRecipients, // a wrapper class for a List<ContactsList> instance, read-only
        schedulingInfo : EmailSchedulingInfo, // see separate description, read-only
        statsEmailAddress : String,
        tweetMessage : String,
        value : String,
};

var EmailSchedulingInfo = {
        // members and accessors
        archiveOptions : { // EmailArchiveOptions
            // members and accessors
            archiveWhenSent : boolean
            includeShareButton : boolean
            // methods
            isSocialShareBarDefaultOn()
        },
        deliveryDate : { // EmailDeliveryDate
            // members and accessors
            calendar : Calendar,
            date : String,
            deliveryOption : String,
            hour : String,
            latestSchedulingDate : Calendar,
            meridian : String,
            minute : String,
            pm : boolean,
            timeZone : String,
            // methods
            clearCalendar(),
            generateCalendarFromFields(),
            getFormattedLatestSchedulingDate(),
            getLatestSchedulingDate(),
            getSchedule(),
            initCalendar(Calendar, SiteOwnerObject),
            isScheduledDateBeforeLatestDate(),
        },
        statsOptions : { // EmailStatsOptions
            sendStatsEmail : boolean,
            statsEmailAddress : String,
        },
};


var eco = {
        // BaseDocument
        // members and accessors
        elements : LinkedList, // LinkedList<BaseDocument>
        html : String,
        name : String,
        rootTag : String,
        text : String,
        useDefaultText : boolean,

        // methods
        clean(),
        equals(Object),
        hashCode(),
        toString(),
        
        // EmailCampaignObject
        // members and accessors
        agentUID : long,
        css : StyleSheet,
        googleAnalyticsSettings : GoogleAnalyticsSettingsObject,
        isModified : boolean,
        isNew : boolean,
        messageFooter : MessageFooterObject,
        messageHeader : MessageHeaderObject,
        nextBlockIndex : int,
        ownerUID : long,
        recatalog : boolean,
        tableOfContents : Map,
        templateCategory : String,
        templateUID : long,
        
        // methods
        addThirdPartyBlock(String, String, String),
        addThirdPartyBlock(String, String, String, String),
        canAdd(),
        cloneBlock(BlockObject, String, String),
        cloneBlock(String, String, String, String),
        cloneGroup(String, String, String),
        copyBlock(String, String),
        createCustomBlock(String, String, String, String),
        deleteBlock(String, String, boolean),
        getAgentProperties(),
        getBlockPanel(String),
        getBlockTOCHeading(String),
        getTOCBlock(),
        hasTOCBlock(),
        isBlockNameRecatalogRequired(),
        moveBlock(String, String, String, String),
        recatalogBlockNames(),
        restoreDeletedBlock(String),
        setName(String),
        stopRecatalog(),
        toString(),
        updateBlockTOCHeading(String, String),
        updateTOCItems(TOCBlockObject, String[], String[]),
        
        // DataCampaignObject
        // members and accessors
        agentObject : AgentObject, // see separate definition
        partner : PartnerObject,
        siteOwner : SiteOwnerObject,
};

var Agent = {
        // RovingVectorList
        
        // AgentObject
        // members and accessors
        approvalLevel : int,
        archiveShareLink : String,
        archiveWhenSent : String,
        bPreviouslySent : boolean,
        campaignActivityId : String,
        dbao : DBAccessObject,
        isTemporary : boolean,
        lastTransportPrefix : String,
        m_agentSummary : AgentSummaryObject,
        m_archiveLevel : int,
        m_archiveSchema : String,
        m_attemptedRunCount : int,
        m_bLocked : String,
        m_bounceCount : int,
        m_clickCount : int,
        m_convAmount : double,
        m_convCount : int,
        m_errorCode : int,
        m_execution_callback_url : String,
        m_filter : Filter,
        m_firstRunStart : Calendar,
        m_FwtfCount : int,
        m_headerOnly : boolean,
        m_lastEdit : Calendar,
        m_lastRun : Calendar,
        m_lastRunStart : Timestamp,
        m_lastUpdateTime : Timestamp,
        m_lockedBy : String,
        m_nextRun : Calendar,
        m_openCount : int,
        m_optoutCount : int,
        m_parent : AgentObject,
        m_partnerUID : long,
        m_permProps : RovingObject,
        m_productID : int,
        m_resendSubType : String,
        m_resendType : String,
        m_roleCode : int,
        m_runStart : Timestamp,
        m_runtimeStats : AgentRuntimeStats,
        m_runTrackingInformationSchema : String,
        m_schedRun : Calendar,
        m_sentCount : int,
        m_shadowOutputPropsContainer : RovingObject,
        m_showAgent : boolean,
        m_siteOwnerUID : long,
        m_sortDate : Calendar,
        m_spamCount : int,
        m_status : String,
        m_subStatus : String,
        m_template : AgentTemplateObject,
        m_templateShortName : String,
        m_templateStyle : String,
        m_templateUID : long,
        m_templateVersion : int,
        m_uid : long,
        
        // static members, methods and constants
        blockPattern : Pattern,
        lastReloadTime : Calendar,
        LOG : IRovingLogger,
        panelPattern : Pattern,
        RMC_V8_AGENT_CLEANUP_ENABLED : String,
        trackingSchemaList : ArrayList<TrackingSchemaObject>,
        getDefaultMailingTime(),
        getDelayedScheduleTime(Calendar),
        getNewScheduledDateTime(Calendar, boolean),
        getPermanentTrackingSchema(int),
        instantiateAgent(AgentTemplateObject, RovingObject),
        instantiateAgent(AgentTemplateObject, RovingObject, AgentObject),
        instantiateAgent(AgentTemplateObject, String, int, RovingObject, AgentObject),
        instantiateAgent(AgentTemplateObject, String, RovingObject, AgentObject),
        instantiateAgent(String, int, RovingObject),
        setAgentForTracking(int, long),

        // methods
        addDomainCallback(NodeURL),
        addTemplate(AgentTemplateObject, AgentObject),
        allowMultiple(),
        cancelFailingAgent(),
        cleanup(),
        cloneAgent(),
        cloneAgent(SiteOwnerObject),
        cloneApprovalLevel(AgentObject, Object),
        equals(Object),
        eventInvitation(),
        eventNoResponderReminderEmail(),
        eventRegEmail(),
        fixOldAgentProperties(AgentObject, int),
        getAgentFromInputProps(AgentTemplateObject, RovingObject),
        getAncestor(),
        getAttrFilterIds(),
        getDomainCallback(NodeURL),
        getDomainCallbackCount(),
        getDomainCallbacks(),
        getDomainCallbackUrl(NodeURL),
        getDummyArchiveSiteVisitor(),
        getDummyArchiveSiteVisitor(SiteVisitorDetailObject),
        getDummySiteVisitor(),
        getDummySiteVisitor(Map<String, String>),
        getEJBHomeName(),
        getExternalName(),
        getIntCatIdList(),
        getInterestCategoryIdList(),
        getInterestCategoryNameList(SiteOwnerObject),
        getInterestCategoryVector(),
        getMemcachedKey(String),
        getPermalinkShortUrl(),
        getPermalinkUrl(),
        getPK(),
        handleImageRoot(String),
        ignoreMissingContactListOnResend(),
        insertAgent(),
        isEventRelated(),
        isShareBarDefault(),
        isShareBarEnabled(),
        logSchedulingEvent(String, String, SiteOwnerObject),
        makeDomainCallbackKey(int),
        makeDomainCallbackValue(NodeURL),
        needToFix(String),
        parseDomainCallbackValue(String),
        persistOutputProps(),
        populateString(String),
        populateString(String, RovingObject),
        refreshAgentSummary(),
        refreshRuntimeStats(),
        removeDomainCallback(NodeURL),
        removeOutputProps(),
        removeUnreferencedV8BlockProps(),
        resetTempProps(),
        resolve(IRovingObject, ExpandPart, boolean),
        resolve(RovingObject, ExpandPart),
        resolveString(RovingObject, String),
        setCloneApprovalLevel(AgentObject, long),
        setDefaultArchiveLevel(SiteOwnerObject),
        setExternalName(String),
        setMultiRowProps(Hashtable),
        setOutputProp(String, Object),
        setPermalinkShortUrl(String),
        setPermalinkUrl(String),
        setShareBarEnabled(boolean),
        update(String),
        updateHeader(String),
};