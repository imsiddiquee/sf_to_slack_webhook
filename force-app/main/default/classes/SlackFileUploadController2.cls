// SlackFileUploadController2.uploadPdfToSlack('hello','');

public with sharing class SlackFileUploadController2 {

    private static final String SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';
    //SlackFileUploadController2.webhookPublishMessageToSlack('Hello Slack!');
    @AuraEnabled
    public static String webhookPublishMessageToSlack(String msg) {
        String json_string = prepareJSON(msg).getAsString();

        // API callout
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SLACK_WEBHOOK);
        request.setMethod('POST');
        request.setBody(json_string);

        Http http = new Http();
        try {
            HttpResponse response = http.send(request);              

           return JSON.serialize(new Map<String, String>{'status' => response.getStatus(), 'message' => 'Message uploaded to Slack successfully!'});
        } catch (Exception ex) {
            System.debug('Callout exception-->'+ex.getMessage());
            return JSON.serialize(new Map<String, String>{'status' => '400', 'message' => ex.getMessage()});
            
        }
    }

    // Utility method to generate JSON
    private static JSONGenerator prepareJSON(String msg) {
        JSONGenerator json = JSON.createGenerator(true);
        json.writeStartObject();
        json.writeStringField('text', msg);
        json.writeEndObject();
        return json;
    }
}
