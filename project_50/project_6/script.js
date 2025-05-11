document.getElementById('zodiacSign').addEventListener('change', function() {
    const zodiacSign = this.value;
    let resultMessage;

    switch (zodiacSign) {
        case 'aries':
            resultMessage = "Ariesはあなたのエネルギーが強い、勇気とリーダーシップを誇ります。";
            break;
        case 'taurus':
            resultMessage = "Taurusはあなたは堅固で優しい性格を持っています。リラックスして時間を楽しむことが重要です。";
            break;
        case 'gemini':
            resultMessage = "Geminiはあなたの好奇心と多様性が魅力的です。新しい知識を学び、新しい経験を共有することが大切です。";
            break;
        case 'cancer':
            resultMessage = "Cancerはあなたは愛と家族に強く関心があります。感情的で保護的な性格ですが、もしご争いやストレスが増える場合、適切なコミュニケーションが必要です。";
            break;
        case 'leo':
            resultMessage = "Leoはあなたは魅力的で自信をもっています。人の視線を引く力強い存在として知られています。";
            break;
        case 'virgo':
            resultMessage = "Virgoはあなたの詳細と秩序性が高く、ミスの少ない性格です。自分自身に忠実し、他人からも尊重を得るためには努力が必要です。";
            break;
        case 'libra':
            resultMessage = "Libraはあなたは平衡感と協調能力が高く、公正で優しい人として知られています。友達や家族との関係を大切にしてください。";
            break;
        case 'scorpio':
            resultMessage = "Scorpioはあなたの決断力と好奇心に魅力があります。深遠な感情を持つことができる一方で、過度な執着とプライバシーの問題にも注意が必要です。";
            break;
        case 'sagittarius':
            resultMessage = "Sagittariusはあなたは自由と希望を持っています。真理を探求し、新しい視点をもたらすことが重要です。";
            break;
        case 'capricornus':
            resultMessage = "Capricornusはあなたの責任感と自律性が高く、目標に向けた行動が重要です。慎重な計画と実現可能なタスクを達成することが重要です。";
            break;
        case 'aquarius':
            resultMessage = "Aquariusはあなたは独立性和創造力を持つ人として知られています。新しいアイデアや改革を求めることが多く、他人との関係には少しの距離を感じるかもしれません。";
            break;
        default:
            resultMessage = "占い結果がありません。星座を選択してください。";
    }

    document.getElementById('resultMessage').textContent = resultMessage;
});
