
Pod::Spec.new do |spec|
  spec.name         = 'EduSmallClassDemo'
  spec.version      = '1.0.0'
  spec.summary      = 'EduSmallClassDemo APP'
  spec.description  = 'EduSmallClassDemo App Demo..'
  spec.homepage     = 'https://github.com/volcengine'
  spec.license      = { :type => 'MIT', :file => 'LICENSE' }
  spec.author       = { 'author' => 'volcengine rtc' }
  spec.source       = { :path => './'}
  spec.ios.deployment_target = '9.0'
  
  spec.source_files = '**/*.{h,m,c,mm}'
  spec.resource_bundles = {
    'EduSmallClassDemo' => ['Resource/EduSmallClass.xcassets'],
    'EduSmallClassDemoLight' => ['Resource/EduSmallClassLight.xcassets']
  }
  spec.pod_target_xcconfig = {'CODE_SIGN_IDENTITY' => ''}
  spec.prefix_header_contents = '#import "Masonry.h"',
                                '#import "Core.h"',
                                '#import "EduSmallClassDemoConstants.h"'
  spec.dependency 'Core'
  spec.dependency 'YYModel'
  spec.dependency 'Masonry'
  spec.dependency 'VolcEngineRTC'
  spec.dependency 'VolcEngineWhiteboard'
end
