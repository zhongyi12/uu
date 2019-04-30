 !macro customHeader
   !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
 !macroend

 !macro preInit
   ; This macro is inserted at the beginning of the NSIS .OnInit callback
   !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
 !macroend

 !macro customInit
   !system "echo '' > ${BUILD_RESOURCES_DIR}/customInit"
 !macroend

 !macro customInstall
   !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
   ExecWait '"$INSTDIR\resources\studio\driver\dpinst-amd64.exe" /A /SE /SW /SA'
   ExecWait '"$INSTDIR\resources\studio\vc++\vc_redist.x64.exe" /Q'
 !macroend
