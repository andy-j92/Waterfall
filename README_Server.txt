	Amazon Web Services
===========================

Note* The cloud computer is running an Ubunutu 14.04 instance. 

1. If your on Windows: 
	- Make sure you have either Bash for Windows installed or Powershell.
	- Any other mechanism that enables Secure Shell (ssh) is also viable.
2. Navigate into the WebClientAWS folder within the repository.
3. Execute the command "ssh -i WebClient1.pem ubuntu@18.220.214.223".
4. The server should already be running. 
5. This is running on a thread in a background screen.
6. Reattach screen by executing "screen -r".
7. Execute "ctrl+c" to terminate server.
8. If there are permission errors, make sure that the permission for the file is set to
	- chmod 600 WebClient1.pem


