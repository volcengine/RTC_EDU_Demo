Pod::Spec.new do |spec|
  spec.name         = 'EduDemo'
  spec.version      = '1.0.0'
  spec.summary      = 'EduDemo APP'
  spec.description  = 'EduDemo App Demo..'
  spec.homepage     = 'https://github.com/volcengine'
  spec.license      = { :type => 'MIT', :file => 'LICENSE' }
  spec.author       = { 'author' => 'volcengine rtc' }
  spec.source       = { :path => './' }
  spec.ios.deployment_target = '9.0'
  
  spec.source_files = '**/*.{h,m,c,mm,a}'
  spec.resource_bundles = {
    'EduDemo' => ['Resource/*.xcassets']
  }
  spec.pod_target_xcconfig = {'CODE_SIGN_IDENTITY' => ''}
  spec.resources = ['Resource/*.{jpg}']
  spec.prefix_header_contents = '#import "Masonry.h"',
                                '#import "Core.h"',
                                '#import "EduClassCpmponents.h"',
                                '#import "EduDemoConstants.h"',
                                '#import "EduUserModel.h"',
                                '#import "EduClassModel.h"',
                                '#import "EduBreakoutClassModel.h"',
                                '#import "EduRoomModel.h"'
                                
  spec.vendored_frameworks = 'HFOpenApi.framework'
  spec.dependency 'Core'
  spec.dependency 'YYModel'
  spec.dependency 'Masonry'
  spec.dependency 'VolcEngineRTC'

end
