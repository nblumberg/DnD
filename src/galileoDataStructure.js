var command = {
        // CORE
        // members and accessors
        agentId : long,
        getAgentId(),
        setAgentId(long),
        
        allowScheduling : boolean,
        getAllowScheduling(),
        isAllowScheduling(), // allowScheduling & !isInListReview();
        setAllowScheduling(boolean),
        
        copyFromSourceEmail : boolean,
        isCopyFromSourceEmail(),
        setCopyFromSourceEmail(boolean),
        
        emailStatusDisplayText : String,
        getEmailStatusDisplayText(),
        setEmailStatusDisplayText(String),
        
        emptyRecipientLists : boolean,
        isEmptyRecipientLists(),
        setEmptyRecipientLists(boolean),

        loadEmail : boolean,
        getLoadEmail(),
        isLoadEmail(),
        setLoadEmail(boolean),
        
        missingImages : boolean,
        isMissingImages(),
        setMissingImages(boolean),

        missingPhysicalAddress : boolean,
        getMissingPhysicalAddress(),
        isMissingPhysicalAddress(),
        setMissingPhysicalAddress(boolean),

        missingVerifiedEmailAddress : boolean,
        getMissingVerifiedEmailAddress(),
        isMissingVerifiedEmailAddress(),
        setMissingVerifiedEmailAddress(boolean),

        preRenderComplete : boolean,
        getPreRenderComplete(),
        isPreRenderComplete(),
        setPreRenderComplete(boolean),

        request : HttpServletRequest,
        getRequest(),
        setRequest(HttpServletRequest),

        response : HttpServletResponse,
        getResponse(),
        setResponse(HttpServletResponse),

        settings : { // EmailSettings
            emailName : String,
            getEmailName(),
            setEmailName(String),
            
            footer : MessageFooterObject, // effectively caches getEco().getMessageFooter()
            getHeader(),
            
            header : MessageHeaderObject, // effectively caches getEco().getMessageHeader()
            getFooter(),
            
            recipientsMsg : String,
            getRecipientsMsg(),
            setRecipientsMsg(String)
            
            EmailSettings(),
            EmailSettings(MessageHeaderObject, MessageFooterObject, String),
        },
        getSettings(),
        setSettings(EmailSettings),

        sourceEmailAgentUid : long,
        getSourceEmailAgentUid(),
        setSourceEmailAgentUid(long),
        
        status : String,
        getEmailStatus(),
        setEmailStatus(String),

        supportLink : String,
        getSupportLink(),
        setSupportLink(String),
        
        templateImg : String, // TODO: should be moved to em/?
        getTemplateImg(),
        setTemplateImg(String),

        templateName : String, // TODO: should be moved to em/?
        getTemplateName(),
        setTemplateName(String),

        templateUID : long, // TODO: should be moved to em/?
        getTemplateUID(),
        setTemplateUID(long),

        themeName : String, // TODO: should be moved to es/?
        getThemeName(),
        setThemeName(String),
        
        // methods
        /*
         * Created by: ecampaignService.createEmailCampaign(this.getSiteOwner(), command.getTemplateName(), "");
         * Loaded by: EmailCampaignManager.generateCampaign(this.agentId, this.getSiteOwner().getUID());
         */
        getEco(), // ((UIStateObject)this.request.getSession().getAttribute("rovingObjects")).getEmailCampaignObject(this.agentId);
        getDco(),
        
        getInListReview(), // this.isInListReview();
        isInListReview(), // this.getSiteOwner().isOverLimits(false);
        
        getSiteOwner(), // getSiteOwnerFacade().getSiteOwner();
        getSiteOwnerFacade(), // (SiteOwnerFacade)request.getAttribute(IConstantsCommon.SO_FACADE_ATTR_NAME);

        isEmailRoleConfirmed(), // EmailCampaignManager.getRoleCode(getEco()) == ITemplateCodes.CONFIRMED;

        setEco(EmailCampaignObject), // puts settings.getHeader() in getEco().setMessageHeader() and copies values from getEco().getMessageFooter() into agent.setPermProp()
        
        // EM
        // members and accessors
        agentApprovalLevel : int,
        
        autoTweetEnabled : boolean,
        isAutoTweetEnabled(),
        setAutoTweetEnabled(boolean),
        
        campaignType : String,
        getCampaignType(),
        setCampaignType(String),
        
        currentState : String,
        getCurrentState(),
        setCurrentState(String),
        
        emailStatsSelected : boolean,
        isEmailStatsSelected(),
        setEmailStatsSelected(boolean),
        
        emailStatus : String,
        getEmailStatus(),
        setEmailStatus(String),
        
        emailType : int,
        
        event : Event,
        getEvent(),
        setEvent(Event),
        
        page : String,
        getPage(),
        setPage(String),
        
        recipients : EmailRecipients, // a wrapper class for a List<ContactsList> instance
        getEmailRecipients(),
        
        schedulingInfo : EmailSchedulingInfo,
        getSchedulingInfo(),
        
        statsEmailAddress : String,
        getStatsEmailAddress(),
        setStatsEmailAddress(String),
        
        tweetMessage : String,
        getTweetMessage(),
        setTweetMessage(String),
        
        value : String,
        getValue(),
        setValue(String)
        
        // methods
        EmailMarketingEmailWizardCommand(),
};

var EmailSchedulingInfo = {
        // members and accessors
        archiveOptions : { // EmailArchiveOptions
            // members and accessors
            archiveWhenSent : boolean
            getArchiveWhenSent()
            isArchiveWhenSent()
            setArchiveWhenSent(boolean)

            includeShareButton : boolean
            getIncludeShareButton()
            isIncludeShareButton()
            setIncludeShareButton(boolean)            
            
            // methods
            isSocialShareBarDefaultOn()
        },
        getArchiveOptions(),
        setArchiveOptions(EmailArchiveOptions),

        deliveryDate : { // EmailDeliveryDate
            // members and accessors
            calendar : Calendar,
            getCalendar(),
            setCalendar(Calendar, TimeZone),
            
            date : String,
            getDate(),
            getDateField(int),
            getDay(),
            getMonth(),
            getYear(),
            setDate(String),

            deliveryOption : String,
            getDeliveryOption(),
            isInFuture(),
            isNow(),
            setDeliveryOption(String),
            setDeliveryOptionFromCampaignStatus(String),
            setToDraft(),
            setToNow()

            hour : String,
            getHour(),
            setHour(String),
            
            latestSchedulingDate : Calendar,
            setLatestSchedulingDate(Calendar),
            
            meridian : String,
            getMeridian(),
            setMeridian(String),
            
            minute : String,
            getMinute(),
            setMinute(String),

            pm : boolean,
            getAmPmMarker(),
            isPm(),
            setPm(boolean),
            
            timeZone : String,
            getTimeZone(),
            setTimeZone(String),
            
            // methods
            EmailDeliveryDate(),
            EmailDeliveryDate(int, int, int),
            clearCalendar(),
            generateCalendarFromFields(),
            getFormattedLatestSchedulingDate(),
            getLatestSchedulingDate(),
            getSchedule(),
            initCalendar(Calendar, SiteOwnerObject),
            isScheduledDateBeforeLatestDate(),
        },
        getDeliveryDate(),
        setDeliveryDate(EmailDeliveryDate),

        statsOptions : { // EmailStatsOptions
            sendStatsEmail : boolean,
            isSendStatsEmail(),
            setSendStatsEmail(boolean),
            
            statsEmailAddress : String,
            getStatsEmailAddress(),
            setStatsEmailAddress(String)            
        },
        getStatsOptions(),
        setStatsOptions(EmailStatsOptions)
};


var eco = {
        // BaseDocument
        // members and accessors
        elements : LinkedList, // LinkedList<BaseDocument>
        addDocumentElement(BaseDocument),
        addDocumentElement(BaseDocument, int),
        deleteDocumentElement(BaseDocument),
        deleteDocumentElement(String),
        getDocumentElement(String),
        getElements(),
        getElementCount(),
        getIndexOf(String),

        html : String,
        appendDocumentHtml(String),
        getHtml(),
        getHtmlWithDoctype(),
        setHtml(String),
        
        name : String,
        getName(),
        setName(String),

        rootTag : String,
        getDoctypeDeclaration(),
        setRootTag(String),
        
        text : String,
        getText(),
        getTextWithDoctype(),
        hasTextVersion(),
        setText(String),

        useDefaultText : boolean,
        setUseDefaultText(boolean),

        // methods
        BaseDocument(),
        BaseDocument(String, String),
        BaseDocument(String, String, LinkedList),
        clean(),
        equals(Object),
        hashCode(),
        toString(),
        
        // EmailCampaignObject
        // members and accessors
        agentUID : long,
        getAgentUID(),
        setAgentUID(long),

        css : StyleSheet,
        getCss(),
        setCss(StyleSheet),
        
        googleAnalyticsSettings : GoogleAnalyticsSettingsObject,
        getGoogleAnalyticsSettings(),
        setGoogleAnalyticsSettings(GoogleAnalyticsSettingsObject),

        isModified : boolean,
        isModified(),
        setIsModified(boolean),
        
        isNew : boolean,
        isNew(),
        setIsNew(boolean),

        messageFooter : MessageFooterObject,
        getMessageFooter(),
        setMessageFooter(MessageFooterObject),

        messageHeader : MessageHeaderObject,
        getMessageHeader(),
        setMessageHeader(MessageHeaderObject),

        nextBlockIndex : int,
        getNextBlockIndex(),
        setNextBlockIndex(int),

        ownerUID : long,
        getOwnerUID(),

        recatalog : boolean,
        
        tableOfContents : Map,
        getTableOfContents(),
        setTableOfContents(Map),
        
        templateCategory : String,
        getTemplateCategory(),
        setTemplateCategory(String),

        templateUID : long,
        getTemplateUID(),
        
        // methods
        EmailCampaignObject(long, long, long, String, String, StyleSheet, LinkedList),
        EmailCampaignObject(String, String, LinkedList),
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
        agentObject : AgentObject,
        getAgentObject(),
        setAgentObject(AgentObject)        

        partner : PartnerObject,
        getPartner(),

        siteOwner : SiteOwnerObject,
        getSiteOwner(),

        // methods
        DataCampaignObject(String, LinkedList, AgentObject, SiteOwnerObject, PartnerObject),
        DataCampaignObject(String, StyleSheet, LinkedList, AgentObject, SiteOwnerObject, PartnerObject),
};

var Agent = {
        // RovingVectorList
        
        // AgentObject
        // members and accessors
        approvalLevel : int,
        approvalLevelApproved(),
        approvalLevelDraft(),
        approvalLevelNotApplicable(),
        approvalLevelPending(),
        approvalLevelRejected(),
        getApprovalLevel(),
        setApprovalLevel(int),
        
        archiveShareLink : String,
        getArchiveShareLink(),
        isIncludeShareLink(),
        setArchiveShareLink(String),
        setIncludeShareLink(boolean),
        
        archiveWhenSent : String,
        getArchiveWhenSent(),
        isArchiveWhenSent(),
        setArchiveWhenSent(boolean),
        setArchiveWhenSent(String),

        bPreviouslySent : boolean,
        setPreviouslySent(boolean),
        wasPreviouslySent()
        
        campaignActivityId : String,
        getCampaignActivityId(),
        setCampaignActivityId(String),
        
        dbao : DBAccessObject,
        getDBAccessObject(),
        setDBAccessObject(DBAccessObject),

        isTemporary : boolean,
        
        lastTransportPrefix : String,
        getLastTransportPrefix(),
        hasTransportPrefix(),
        setLastTransportPrefix(String),
        
        m_agentSummary : AgentSummaryObject,
        getAgentSummary(),
        setAgentSummary(AgentSummaryObject),
        
        m_archiveLevel : int,
        getArchiveLevel(),
        setArchiveLevel(int),
        
        m_archiveSchema : String,
        getArchiveSchema(),
        setArchiveSchema(String),

        m_attemptedRunCount : int,
        getAttemptedRuns(),
        setAttemptedRuns(int),
        
        m_bLocked : String,
        getBLocked(),
        setBLocked(String),

        m_bounceCount : int,
        getBounceCount(),
        setBounceCount(int),

        m_clickCount : int,
        getClickCount(),
        setClickCount(int),

        m_convAmount : double,
        getConvAmount(),
        setConvAmount(double),

        m_convCount : int,
        getConvCount(),
        setConvCount(int),

        m_errorCode : int,
        getErrorCode(),
        setErrorCode(int),
        
        m_execution_callback_url : String,
        getExecutionIdsCallbackUrl(),
        setExecutionIdsCallbackUrl(String),
        
        m_filter : Filter,
        getFilter(),
        hasFilter(int),
        setFilter(Filter),
        
        m_firstRunStart : Calendar,
        getFirstRunStart(),
        setFirstRunStart(Calendar),

        m_FwtfCount : int,
        getFwtfCount(),
        setFwtfCount(int),
        
        m_headerOnly : boolean,

        m_lastEdit : Calendar,
        getLastEdit(),
        setLastEdit(),
        setLastEdit(Calendar),

        m_lastRun : Calendar,
        getLastRun(),
        setLastRun(Calendar),

        m_lastRunStart : Timestamp,
        getLastRunStart(),
        isRescheduledForResend(),
        setLastRunStart(Timestamp),
        
        m_lastUpdateTime : Timestamp,
        getLastUpdateTime(),
        getLastUpdateTimeAsLong(),
        setLastUpdateTime(Timestamp),

        m_lockedBy : String,
        getLockedBy(),
        setLockedBy(String),
        
        m_nextRun : Calendar,
        getNextRun(),
        getSchedulerNextRun(),
        setNextRun(Calendar),
        
        m_openCount : int,
        getOpenCount(),
        setOpenCount(int),
        
        m_optoutCount : int,
        getOptoutCount(),
        setOptoutCount(int),
        
        m_parent : AgentObject,
        getParent(),
        
        m_partnerUID : long,
        getPartnerUID(),
        setPartnerUID(long),
        
        m_permProps : RovingObject,
        getPermProps(),
        setPermProp(String, Object),
        
        m_productID : int,
        dealsCampaign(),
        emailMarketingCampaign(),
        getProductID(),
        setProductID(int),
        surveyInvitation(),
        
        m_resendSubType : String,
        getResendSubType(),
        setResendSubType(String),

        m_resendType : String,
        getResendType(),
        setResendType(String),
        
        m_roleCode : int,
        getRoleCode(),
        isRoleCodeOptin(),
        setRoleCode(int),
        
        m_runStart : Timestamp,
        getRunStart(),
        setRunStart(Timestamp),
        
        m_runtimeStats : AgentRuntimeStats,
        getAgentRuntimeStats(),
        setAgentRuntimeStats(AgentRuntimeStats),
        
        m_runTrackingInformationSchema : String,
        getTrackingSchema(),
        setTrackingSchema(String),
        
        m_schedRun : Calendar,
        getScheduledRun(),
        setScheduledRun(Calendar),
        
        m_sentCount : int,
        getSentMailCount(),
        setSentMailCount(int),

        m_shadowOutputPropsContainer : RovingObject,
        
        m_showAgent : boolean,
        setShowAgent(boolean),
        showAgent(),
        
        m_siteOwnerUID : long,
        getSiteOwnerUID(),
        setSiteOwnerUID(long),
        
        m_sortDate : Calendar,
        getSortDate(),
        setSortDate(Calendar),
        
        m_spamCount : int,
        getSpamCount(),
        setSpamCount(int),
        
        m_status : String,
        getStatus(),
        getStatusString(),
        setStatus(String),
        
        m_subStatus : String,
        getSubStatus(),
        setSubStatus(String),
        
        m_template : AgentTemplateObject,
        getTemplate(),
        isV7Campaign(),
        isV8Campaign(),
        
        m_templateShortName : String,
        getTemplateShortName(),
        setTemplateShortName(String),
        
        m_templateStyle : String,
        getTemplateStyle(),
        setTemplateStyle(String),
        
        m_templateUID : long,
        getTemplateUID(),
        setTemplateUID(long),

        m_templateVersion : int,
        getTemplateVersion(),
        setTemplateVersion(int),
        
        m_uid : long,
        getName(),
        getName(String),
        getNumericUID(),
        getUID(),
        hashCode(),
        setUID(long),
        
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
        AgentObject(),
        AgentObject(long),
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