Pod::Spec.new do |s|
    s.name         = "DyScan"
    s.version      = "1.1.20"
    s.summary      = "Credit Card Scanning SDK"
    s.description  = <<-DESC
    DyScan allows users to enter payment information more quickly, reducing friction in the checkout process.
    DESC
    s.homepage     = "https://dyneti.com"
    s.license = { :type => 'Copyright', :text => <<-LICENSE
                   Copyright Dyneti Technologies, Inc. 2021
                  LICENSE
                }
    s.author             = { "Dyneti" => "support@dyneti.com" }
    s.source       = { :git => "https://dyscan@github.com/Dyneti/dyscan-ios-distribution.git", :tag => "#{s.version}" }

    s.platform = :ios
    s.ios.deployment_target  = '9.0'
    s.weak_frameworks = 'Foundation','UIKit','AVFoundation'

    s.default_subspecs = 'Universal'

    s.subspec 'Universal' do |h|
        h.vendored_frameworks = "Universal/DyScan.xcframework"
    end

    s.subspec 'eu' do |g|
        g.vendored_frameworks = "Universal_eu/DyScan.xcframework"
    end

end
